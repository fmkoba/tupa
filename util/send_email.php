<?php
error_reporting(E_ALL ^ E_NOTICE);
$post = (!empty($_POST)) ? true : false;
if ($post)
{
    $to = 'mail@mail.mail'; 
    
    $name = stripslashes($_POST['name']);
    $subject = 'Email from ' . $name;
    $message = stripslashes($_POST['message']);
    if (!filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL)) {
          echo json_encode(array('alert' => 'danger', 'notice' => 'Ops, something went Wrong! Check fields...'));
          die();
    }
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);
    $message = "<p>$message </p>";

    $mail = mail($to, $subject, $message, "from: $name <$email>\nReply-To: $email \nContent-type: text/html");
    $notice = '';
    $alert = '';

    if ($mail) {
        $alert = 'success';
        $notice = 'Thanks for contacting us!';
    } else {
        $alert = 'danger';
        $notice = 'Ops, something went Wrong! Check fields...';
    }
    echo json_encode(array('alert' => $alert, 'notice' => $notice));
    die();
}
?>