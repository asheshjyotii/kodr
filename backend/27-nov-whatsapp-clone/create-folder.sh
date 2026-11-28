
#!/bin/bash

folders=(
    "config"
    "constant"
    "database"
    "middleware"
    "model"
    "modules/private/user"
    "modules/public/auth"
    "repository"
    "shared/error"
    "shared/utils"
    "socket"
)

for folder in "${folders[@]}"; do
    mkdir -p "$folder"
done

echo "Folder structure created successfully!"
