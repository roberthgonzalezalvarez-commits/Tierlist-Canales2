$path = "C:\Users\rober\Desktop\NEUROFLOW 3.0\app.js"
$content = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$orig1 = 'const canalNombreInput = document.getElementById(''canalNombre'');'
$rep1 = "const canalNombreInput = document.getElementById('canalNombre');`r`nconst canalUrlInput = document.getElementById('canalUrl');"

$orig2 = '<span class="channel-name" title="${data.nombre}">${data.nombre}</span>'
$rep2 = '${data.url} ? `<a href="${data.url}" target="_blank" class="channel-name" style="text-decoration:none; color:inherit; cursor:pointer;" title="Ir a ${data.nombre}">${data.nombre}</a>` : `<span class="channel-name" title="${data.nombre}">${data.nombre}</span>`'

$orig3 = 'canalNombreInput.value = ch.nombre;'
$rep3 = "canalNombreInput.value = ch.nombre;`r`n  canalUrlInput.value = ch.url || '';"

$orig4 = 'nombre: canalNombreInput.value.trim(),'
$rep4 = "nombre: canalNombreInput.value.trim(),`r`n    url: canalUrlInput.value.trim(),"

$changed = $false
if ($content.Contains($orig1)) { $content = $content.Replace($orig1, $rep1); $changed=$true }
if ($content.Contains($orig2)) { $content = $content.Replace($orig2, $rep2); $changed=$true }
if ($content.Contains($orig3)) { $content = $content.Replace($orig3, $rep3); $changed=$true }
if ($content.Contains($orig4)) { $content = $content.Replace($orig4, $rep4); $changed=$true }

if ($changed) {
    [IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Modificaciones inyectadas a la fuerza en app.js exitosamente."
} else {
    Write-Host "No se encontraron las cadenas orignales. Quiza ya estaban parcheadas."
}
