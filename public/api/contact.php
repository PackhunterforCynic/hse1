<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

// Helper to parse local .env file or server environment variables
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

// Helper to save data directly to JSON filesystem archive on Hostinger
function save_contact_lead($name, $email, $phone, $service, $message) {
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

    $file_path = $target_dir . '/contact-leads.json';
    $data = ['updatedAt' => gmdate('Y-m-d\TH:i:s\Z'), 'totalLeads' => 0, 'leads' => []];
    
    if (file_exists($file_path)) {
        $content = @file_get_contents($file_path);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) $data = $decoded;
    }

    $new_lead = [
        'id' => 'contact_' . time() . '_' . preg_replace('/[^a-z0-9]/', '', strtolower($name ?: 'guest')),
        'name' => $name,
        'email' => $email,
        'phone' => $phone ?: '—',
        'service' => $service ?: 'General Consultation',
        'message' => $message,
        'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
        'status' => 'New'
    ];

    if (!isset($data['leads']) || !is_array($data['leads'])) {
        $data['leads'] = [];
    }
    array_unshift($data['leads'], $new_lead);
    $data['totalLeads'] = count($data['leads']);
    $data['updatedAt'] = gmdate('Y-m-d\TH:i:s\Z');

    @file_put_contents($file_path, json_encode($data, JSON_PRETTY_PRINT));
    return true;
}

$input = file_get_contents('php://input');
$body = json_decode($input, true) ?: [];

// Honeypot check
if (!empty($body['company'])) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
    exit();
}

$name = trim($body['name'] ?? '');
$email = trim($body['email'] ?? '');
$phone = trim($body['phone'] ?? '');
$service = trim($body['service'] ?? '');
$subService = trim($body['subService'] ?? '');
$message = trim($body['message'] ?? '');
$fullService = $subService ? ($service ? "$service ($subService)" : $subService) : $service;

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Validation Error', 'message' => 'Name, email, and message are required fields.']);
    exit();
}

// 1. Save lead to local JSON storage
save_contact_lead($name, $email, $phone, $fullService, $message);

// 2. Dispatch Email via Resend API or native PHP fallback
$resend_api_key = get_env_var('RESEND_API_KEY');
$from_email = get_env_var('FROM_EMAIL', 'onboarding@resend.dev');
$contact_email = get_env_var('CONTACT_EMAIL', 'robinson30122000@gmail.com');

$email_subject = "✦ [NEW CLIENT LEAVE] {$name} (" . ($fullService ?: 'Consultation') . ")";
$email_html = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #050505; color: #efe6d2; padding: 40px;\">
  <h2 style=\"color: #b39a64;\">✦ HAVILAH STUDIO - NEW CLIENT LEAVE</h2>
  <p><strong>Name:</strong> {$name}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Phone:</strong> {$phone}</p>
  <p><strong>Service:</strong> {$fullService}</p>
  <hr style=\"border: 1px solid #26231c; margin: 20px 0;\" />
  <p><strong>Message:</strong><br />" . nl2br(htmlspecialchars($message)) . "</p>
</div>";

if (!empty($resend_api_key)) {
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $resend_api_key,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'from' => "Havilah Studio CRM <{$from_email}>",
        'to' => [$contact_email],
        'reply_to' => $email,
        'subject' => $email_subject,
        'html' => $email_html
    ]));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    @curl_exec($ch);
    curl_close($ch);
} else {
    // Native PHP mail fallback
    $headers = "From: Havilah CRM <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'havilahpro.com') . ">\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    @mail($contact_email, $email_subject, $email_html, $headers);
}

echo json_encode(['success' => true, 'message' => 'Inquiry received and saved successfully.']);
