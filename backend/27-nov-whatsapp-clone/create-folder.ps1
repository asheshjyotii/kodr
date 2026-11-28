$folders = @(
    "config",
    "constant",
    "database",
    "middleware",
    "model",
    "modules/private/user",
    "modules/public/auth",
    "repository",
    "shared/error",
    "shared/utils",
    "socket"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

Write-Host "Folder structure created successfully!" -ForegroundColor Green