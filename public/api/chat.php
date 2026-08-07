<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method Not Allowed";
    exit();
}

function get_env_var($key, $default = '') {
    if (getenv($key) !== false) return getenv($key);
    if (isset($_ENV[$key])) return $_ENV[$key];
    $env_paths = [dirname(__DIR__, 2) . '/.env', dirname(__DIR__) . '/.env', $_SERVER['DOCUMENT_ROOT'] . '/.env'];
    foreach ($env_paths as $path) {
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2 && trim($parts[0]) === $key) {
                    return trim($parts[1], " \"'");
                }
            }
        }
    }
    return $default;
}

function save_chat_history($body, $reply_text) {
    $dirs = [
        dirname(__DIR__, 2) . '/server/data',
        dirname(__DIR__) . '/server/data',
        $_SERVER['DOCUMENT_ROOT'] . '/server/data',
        $_SERVER['DOCUMENT_ROOT'] . '/data'
    ];
    $target_dir = null;
    foreach ($dirs as $dir) {
        if (is_dir($dir) || @mkdir($dir, 0755, true)) {
            $target_dir = $dir;
            break;
        }
    }
    if (!$target_dir) return false;

    $file_path = $target_dir . '/chats-history.json';
    $data = ['updatedAt' => gmdate('Y-m-d\TH:i:s\Z'), 'totalSessions' => 0, 'sessions' => []];
    
    if (file_exists($file_path)) {
        $content = @file_get_contents($file_path);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) $data = $decoded;
    }

    $messages = $body['messages'] ?? [];
    if (!empty($reply_text)) {
        $messages[] = ['role' => 'assistant', 'content' => $reply_text, 'timestamp' => gmdate('Y-m-d\TH:i:s\Z')];
    }
    
    $session_id = $body['sessionId'] ?? ('sess_' . time());
    $existing_idx = -1;
    if (isset($data['sessions']) && is_array($data['sessions'])) {
        foreach ($data['sessions'] as $idx => $s) {
            if (($s['id'] ?? '') === $session_id) {
                $existing_idx = $idx;
                break;
            }
        }
    } else {
        $data['sessions'] = [];
    }

    $session_obj = [
        'id' => $session_id,
        'userName' => $body['userName'] ?? 'Anonymous Guest',
        'pageContext' => $body['pageContext'] ?? '/',
        'lastUpdated' => gmdate('Y-m-d\TH:i:s\Z'),
        'messageCount' => count($messages),
        'messages' => $messages
    ];

    if ($existing_idx > -1) {
        $data['sessions'][$existing_idx] = array_merge($data['sessions'][$existing_idx], $session_obj);
    } else {
        array_unshift($data['sessions'], $session_obj);
    }

    $data['totalSessions'] = count($data['sessions']);
    $data['updatedAt'] = gmdate('Y-m-d\TH:i:s\Z');

    @file_put_contents($file_path, json_encode($data, JSON_PRETTY_PRINT));
    return true;
}

$input = file_get_contents('php://input');
$body = json_decode($input, true) ?: [];
$messages = $body['messages'] ?? [];
$page_context = $body['pageContext'] ?? '/';

$api_key = get_env_var('GEMINI_API_KEY');
if (empty($api_key)) {
    $api_key = get_env_var('VITE_GEMINI_API_KEY');
}

if (empty($api_key)) {
    echo "Welcome to Havilah Studio. Please note that the GEMINI_API_KEY environment variable is missing on this Hostinger server. Our creative team invites you to explore our works or reach out directly via the Contact page.";
    exit();
}

// Read studio strategy prompt
$system_prompt = "You are a premium AI Concierge for Havilah Studio, an elite creative studio in Bangalore, India. Your role is to provide eloquent, authoritative consultative insights.";
$strategy_paths = [dirname(__DIR__, 2) . '/strategy.txt', dirname(__DIR__) . '/strategy.txt', $_SERVER['DOCUMENT_ROOT'] . '/strategy.txt'];
foreach ($strategy_paths as $path) {
    if (file_exists($path)) {
        $system_prompt = file_get_contents($path);
        break;
    }
}

$formatted_messages = [];
foreach ($messages as $msg) {
    $role = ($msg['role'] ?? '') === 'assistant' ? 'model' : 'user';
    $text = $msg['content'] ?? '';
    if (!empty($text)) {
        $formatted_messages[] = [
            'role' => $role,
            'parts' => [['text' => $text]]
        ];
    }
}
if (empty($formatted_messages) || $formatted_messages[count($formatted_messages) - 1]['role'] !== 'user') {
    $formatted_messages[] = ['role' => 'user', 'parts' => [['text' => 'Hello']]];
}

$models_to_try = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
$reply_text = "Welcome to Havilah Studio! We invite you to explore our bespoke film production and photography services or book a consultation via our Contact page.";

foreach ($models_to_try as $model) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . urlencode($api_key);
    $payload = json_encode([
        'system_instruction' => ['parts' => [['text' => $system_prompt]]],
        'contents' => $formatted_messages,
        'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => 800]
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $response = @curl_exec($ch);
    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status_code === 200 && !empty($response)) {
        $json = json_decode($response, true);
        if (!empty($json['candidates'][0]['content']['parts'][0]['text'])) {
            $reply_text = trim($json['candidates'][0]['content']['parts'][0]['text']);
            break;
        }
    }
}

save_chat_history($body, $reply_text);
echo $reply_text;
