# Emergency Configuration Test
# Simplest possible setup

Write-Host "🔍 Checking Configuration..." -ForegroundColor Cyan
Write-Host ""

# Check .env
Write-Host "📄 Current .env:" -ForegroundColor Yellow
Get-Content .env
Write-Host ""

# Check if app is running
Write-Host "🔍 Checking if app is running..." -ForegroundColor Yellow
$process = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "✅ Node process found" -ForegroundColor Green
} else {
    Write-Host "❌ No Node process - app not running" -ForegroundColor Red
}
Write-Host ""

# Check port
Write-Host "🔍 Checking port 4500..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName localhost -Port 4500 -WarningAction SilentlyContinue
if ($connection.TcpTestSucceeded) {
    Write-Host "✅ Port 4500 is open" -ForegroundColor Green
} else {
    Write-Host "❌ Port 4500 is not accessible" -ForegroundColor Red
}
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Stop app: Ctrl+C" -ForegroundColor White
Write-Host "2. Start app: npm start" -ForegroundColor White
Write-Host "3. Open: http://localhost:4500" -ForegroundColor White
Write-Host "4. Check console (F12) for errors" -ForegroundColor White
