$url = 'https://www.youtube.com/@elxokas'
try {
    $res = Invoke-RestMethod -Uri "https://api.codetabs.com/v1/proxy?quest=$url" -TimeoutSec 5
    Write-Host "CODETABS SUCCESS! Length: $($res.Length)"
    if ($res -match '<title>(.*?)</title>') { Write-Host "Title: $($matches[1])" }
} catch { Write-Host "CODETABS FAILED: $_" }

try {
    $res = Invoke-RestMethod -Uri "https://corsproxy.io/?$url" -TimeoutSec 5
    Write-Host "CORSPROXY SUCCESS! Length: $($res.Length)"
    if ($res -match '<title>(.*?)</title>') { Write-Host "Title: $($matches[1])" }
} catch { Write-Host "CORSPROXY FAILED: $_" }
