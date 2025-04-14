<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    $to = "ton-email@domaine.com"; // À remplacer par ton email réel
    $subject = "Message depuis BlogCleason";
    $body = "Nom : $nom\nEmail : $email\nMessage :\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        header("Location: merci.html"); // Redirection vers la page de confirmation
        exit;
    } else {
        echo "Une erreur s'est produite. Veuillez réessayer.";
    }
}
?>
