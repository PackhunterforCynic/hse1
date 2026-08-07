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

function save_internship_application($body) {
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

    $file_path = $target_dir . '/internships-archive.json';
    $data = ['updatedAt' => gmdate('Y-m-d\TH:i:s\Z'), 'totalApplications' => 0, 'applications' => []];
    
    if (file_exists($file_path)) {
        $content = @file_get_contents($file_path);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) $data = $decoded;
    }

    $new_app = [
        'id' => 'intern_' . time() . '_' . preg_replace('/[^a-z0-9]/', '', strtolower($body['name'] ?? 'applicant')),
        'name' => $body['name'] ?? '',
        'email' => $body['email'] ?? '',
        'phone' => $body['phone'] ?? '',
        'institution' => $body['institution'] ?? '',
        'fieldOfStudy' => $body['fieldOfStudy'] ?? '',
        'role' => $body['role'] ?? '',
        'skills' => $body['skills'] ?? '',
        'portfolioLink' => $body['portfolioLink'] ?? '—',
        'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
        'status' => 'New'
    ];

    if (!isset($data['applications']) || !is_array($data['applications'])) {
        $data['applications'] = [];
    }
    array_unshift($data['applications'], $new_app);
    $data['totalApplications'] = count($data['applications']);
    $data['updatedAt'] = gmdate('Y-m-d\TH:i:s\Z');

    @file_put_contents($file_path, json_encode($data, JSON_PRETTY_PRINT));
    return true;
}

$input = file_get_contents('php://input');
$body = json_decode($input, true) ?: [];

if (!empty($body['company'])) {
    echo json_encode(['success' => true, 'message' => 'Application received successfully.']);
    exit();
}

$name = trim($body['name'] ?? '');
$email = trim($body['email'] ?? '');
$role = trim($body['role'] ?? '');

if (empty($name) || empty($email) || empty($role)) {
    http_response_code(400);
    echo json_encode(['error' => 'Validation Error', 'message' => 'Name, email, and target role are required fields.']);
    exit();
}

save_internship_application($body);

// Dispatch Email Notification
$resend_api_key = get_env_var('RESEND_API_KEY');
$from_email = get_env_var('FROM_EMAIL', 'onboarding@resend.dev');
$contact_email = get_env_var('CONTACT_EMAIL', 'robinson30122000@gmail.com');

$email_subject = "✦ [INTERNSHIP APPLICATION] {$name} - {$role}";
$email_html = "<div style=\"font-family: sans-serif; background: #050505; color: #efe6d2; padding: 40px;\">
  <h2 style=\"color: #10b981;\">✦ NEW TALENT RECRUITMENT DOSSIER</h2>
  <p><strong>Applicant:</strong> {$name}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Phone:</strong> " . ($body['phone'] ?? '—') . "</p>
  <p><strong>Role Applied For:</strong> {$role}</p>
  <p><strong>Institution / University:</strong> " . ($body['institution'] ?? '—') . "</p>
  <p><strong>Portfolio Link:</strong> <a style=\"color: #efe6d2;\" href=\"" . ($body['portfolioLink'] ?? '#') . "\">" . ($body['portfolioLink'] ?? '—') . "</a></p>
  <hr style=\"border: 1px solid #26231c; margin: 20px 0;\" />
  <p><strong>Skills & Qualifications:</strong><br />" . nl2br(htmlspecialchars($body['skills'] ?? '')) . "</p>
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
        'from' => "Havilah Studio Talent <{$from_email}>",
        'to' => [$contact_email],
        'reply_to' => $email,
        'subject' => $email_subject,
        'html' => $email_html
    ]));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    @curl_exec($ch);
    curl_close($ch);
}

echo json_encode(['success' => true, 'message' => 'Application received and saved successfully.']);
