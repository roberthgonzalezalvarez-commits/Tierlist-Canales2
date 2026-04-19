$url = 'https://www.youtube.com/@elxokas'
$apiUrl = 'https://api.allorigins.win/get?url=' + [uri]::EscapeDataString($url)
$response = Invoke-RestMethod -Uri $apiUrl
Write-Host "Length of contents: $($response.contents.Length)"
if ($response.contents -match '<meta property="og:title" content="(.*?)">') {
    Write-Host "Title: $($matches[1])"
}
if ($response.contents -match '<meta property="og:image" content="(.*?)">') {
    Write-Host "Image: $($matches[1])"
}
