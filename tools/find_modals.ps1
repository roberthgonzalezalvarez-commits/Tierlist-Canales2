$lines = Get-Content "C:\Users\rober\Desktop\NEUROFLOW 3.0\app.js"
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "modal") {
        Write-Host "$($i + 1): $($lines[$i])"
    }
}
