# Test the socialPoster function using PowerShell
$uri = "http://127.0.0.1:5001/pukeko-social/us-central1/socialPoster"
$body = @{
    platform = "twitter"
    content = "Test post from Firebase function via PowerShell! Time: $(Get-Date)"
    apiKey = "test_key"
    accessToken = "test_token"
    secretToken = "test_secret"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Sending test request to $uri" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Method POST -Uri $uri -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response
        $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Response content: $errorContent" -ForegroundColor Red
    }
}
