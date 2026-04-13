$files = Get-ChildItem -Path "src", "index.html" -Recurse -File -Include *.js,*.jsx,*.css,*.html
foreach ($file in $files) {
    if (Test-Path $file.FullName) {
        $content = [IO.File]::ReadAllText($file.FullName)
        if ($content -match "Aurem" -or $content -match "aurem" -or $content -match "AUREM") {
            $newContent = $content.Replace("Aurem", "Auric").Replace("aurem", "auric").Replace("AUREM", "AURIC")
            [IO.File]::WriteAllText($file.FullName, $newContent)
        }
    }
}
Write-Output "Renamed perfectly!"
