# Run tests with coverage
$env:NODE_ENV = "test"
pnpm test --coverage

# Generate coverage report
pnpm test:report

# Check if tests passed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Tests failed!" -ForegroundColor Red
    exit 1
}
