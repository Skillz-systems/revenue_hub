<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Welcome Registeration</title>
</head>

<body>

    <h2>Welcome {{ $user->name }}!</h2>
    <h4>Click on the link below to create your login password</h4>

    <a href="{{ $url }}">Create Password</a>

</body>

</html>
