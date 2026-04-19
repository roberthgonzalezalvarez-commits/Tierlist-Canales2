$html = Get-Content "C:\Users\rober\Desktop\NEUROFLOW 3.0\index.html"
for ($i=0; $i -lt $html.Count; $i++) {
    if ($html[$i] -match "Nombre del canal") {
         $start = [Math]::Max(0, $i - 15)
         $end = [Math]::Min($html.Count - 1, $i + 30)
         for ($j=$start; $j -le $end; $j++) {
             Write-Host "$($j + 1): $($html[$j])"
         }
         break
    }
}
