$lines = Get-Content "C:\Users\rober\Desktop\NEUROFLOW 3.0\app.js"
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "canalNombre") {
        Write-Host "Found canalNombre at line $($i+1)"
        $start = [Math]::Max(0, $i - 5)
        $end = [Math]::Min($lines.Count - 1, $i + 40)
        for ($j=$start; $j -le $end; $j++) {
            Write-Host "$($j + 1): $($lines[$j])"
        }
        break
    }
}
