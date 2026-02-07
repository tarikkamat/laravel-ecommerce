<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <title>İletişim Formu</title>
</head>
<body>
    <h2>İletişim Formu Mesajı</h2>
    <p><strong>Sayfa:</strong> {{ $pageTitle }} ({{ $pageSlug }})</p>
    <p><strong>Ad Soyad:</strong> {{ $name }}</p>
    <p><strong>E-posta:</strong> {{ $email }}</p>
    <p><strong>Telefon:</strong> {{ $phone ?: '-' }}</p>

    <hr>

    <p><strong>Mesaj:</strong></p>
    <p>{!! nl2br(e($messageBody)) !!}</p>
</body>
</html>
