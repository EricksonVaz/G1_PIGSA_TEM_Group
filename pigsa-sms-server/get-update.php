<?php
$validKeyStarDownload = "2bakS6qrOm5QbqA853iOqejK6EviAa";

$keyEnter = trim($_GET["key"] ?? "");

$error = false;
$msg = "";

if ($keyEnter != $validKeyStarDownload) {
    $error = true;
    $msg = "Chave de autenticação inválida";
} else {
    // Create a new instance of the cURL library
    $ch = curl_init();
    // Specify the remote ZIP file URL
    $zipFileURL = "https://mynodejs.host/csu_claims.zip";

    // Define the path where you want to save the downloaded ZIP file
    $zipFilePath = "downloaded.zip";

    // Open the local file for writing
    $fp = fopen($zipFilePath, "w");

    // Open the local file for writing
    $fp = fopen($zipFilePath, "w");

    // Configure cURL options
    curl_setopt($ch, CURLOPT_URL, $zipFileURL);
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    // Execute the cURL request to download the ZIP file
    //if (false) {
    if (curl_exec($ch)) {
        // Close the local file
        fclose($fp);

        // Check if the ZIP file exists
        if (file_exists($zipFilePath)) {
            // Extract the ZIP file
            $zip = new ZipArchive;
            if ($zip->open($zipFilePath) === TRUE) {
                // Delete all files except index.php
                foreach (glob('*') as $file) {
                    if ($file == $zipFilePath) continue;
                    if ($file !== 'get-update.php'  && is_file($file)) {
                        unlink($file);
                    }
                }
                sleep(2);
                $zip->extractTo('./'); // Extract to the current directory
                $zip->close();

                sleep(2);
                // Clean up: delete the downloaded ZIP file
                unlink($zipFilePath);

                $msg = "Download de atualizações feita com sucesso.";
                $error = false;
            } else {
                $msg = "Falha ao extrair o arquivo ZIP.";
                $error = true;
            }
        } else {
            $msg = "Arquivo ZIP não encontrado após o download.";
            $error = true;
        }
    } else {
        $msg = "Falha ao baixar o arquivo ZIP do servidor remoto. Erro: " . curl_error($ch);
        $error = true;
    }

    // Clean up: release resources
    curl_close($ch);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auto Update</title>
    <script src="https://kit.fontawesome.com/549e723401.js" crossorigin="anonymous" defer></script>
    <style>
        *,
        *::after,
        *::before {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            width: 100%;
            min-height: 100vh;
            overflow-x: hidden;
        }

        html {
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            font-size: 62.5%;
            color: white;
        }

        body {
            background-color: #8f65c7;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .card-msg {
            background-color: white;
            border-radius: 5px;
            color: #3c3c3c;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            width: 25rem;
        }

        .icon-container {
            font-size: 10rem;
        }

        .fa-xmark {
            color: tomato;
        }

        .fa-circle-check {
            color: #578b08;
        }

        .msg-error {
            font-size: 2rem;
            text-align: center;
            font-weight: bold;
        }

        @media (max-width:305px) {
            .card-msg {
                width: 95%;
            }
        }
    </style>
</head>

<body>
    <div class="card-msg">
        <div class="icon-container">
            <?php if ($error) { ?>
                <i class="fa-solid fa-xmark"></i>
            <?php } else { ?>
                <i class="fa-regular fa-circle-check"></i>
            <?php } ?>
        </div>
        <div class="msg-error">
            <?= $msg ?>
        </div>
    </div>
</body>

</html>