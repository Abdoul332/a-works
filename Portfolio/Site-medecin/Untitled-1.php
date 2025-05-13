<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nom = htmlspecialchars($_POST["nom"]);
  $email = htmlspecialchars($_POST["email"]);
  $telephone = htmlspecialchars($_POST["telephone"]);
  $date = htmlspecialchars($_POST["date"]);
  $message = htmlspecialchars($_POST["message"]);

  $to = "ton-adresse@mail.com"; // Remplace par ton adresse email
  $subject = "Nouvelle demande de rendez-vous";
  $body = "
    Nom : $nom\n
    Email : $email\n
    Téléphone : $telephone\n
    Date souhaitée : $date\n
    Motif :\n$message
  ";
  $headers = "From: $email";

  if (mail($to, $subject, $body, $headers)) {
    header("Location: merci.html");
    exit();
  } else {
    echo "Erreur : le message n'a pas pu être envoyé.";
  }
}
?>
