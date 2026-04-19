$path = "C:\Users\rober\Desktop\NEUROFLOW 3.0\app.js"
$content = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$bad = '${data.url} ? `<a href="${data.url}" target="_blank" class="channel-name" style="text-decoration:none; color:inherit; cursor:pointer;" title="Ir a ${data.nombre}">${data.nombre}</a>` : `<span class="channel-name" title="${data.nombre}">${data.nombre}</span>`'
$good = '${data.url ? `<a href="${data.url}" target="_blank" class="channel-name" style="text-decoration:none; color:inherit; cursor:pointer;" title="Ir a ${data.nombre}">${data.nombre}</a>` : `<span class="channel-name" title="${data.nombre}">${data.nombre}</span>`}'

if ($content.Contains($bad)) {
    $content = $content.Replace($bad, $good)
    [IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "APP JS REPARADO"
} else {
    Write-Host "No se encontro la cadena mala."
}
