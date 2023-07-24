<?php
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

//Database Connection
$conn = new mysqli('localhost','root','','hemraj');
if($conn->connect_error){
die('Connection Failed : ' .$conn->connect_error);
}else
{
$stmt = $conn->prepare("Insert into test(name, email,subject, message )
                   values(?,?,?,?)");
     $stmt->bind_param("ssss", $name, $email, $subject, $message);
  $stmt->execute();
  echo "Message Sent Successfully...."
    $stmt->close();
  $conn->close();
}

/*

  $receiving_email_address = '#####';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  
  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  $contact->subject = $_POST['subject'];

  $contact->smtp = array(
    'host' => '######',
    'username' => '#####',
    'password' => '###',
    'port' => '587'
  );
  

  $contact->add_message( $_POST['name'], 'From');
  $contact->add_message( $_POST['email'], 'Email');
  $contact->add_message( $_POST['message'], 'Message', 10);

  echo $contact->send();
*/
?>
