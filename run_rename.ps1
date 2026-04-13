$exts = @('.js', '.jsx', '.css', '.html', '.md')
$count = 0
Get-ChildItem -Path "src" -Recurse | Where-Object { $exts -contains $_.Extension } | ForEach-Object {
    $content = Get-Content -Path $_.FullName -Raw -Encoding UTF8
    if ($content -match "Aurem|aurem|AUREM") {
        $newContent = $content -creplace "AUREM", "AURIC" -creplace "aurem", "auric" -creplace "Aurem", "Auric"
        if ($content -cne $newContent) {
            # Write with UTF8 without BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($_.FullName, $newContent, $utf8NoBom)
            Write-Host "Updated: $($_.FullName)"
            $count++
        }
    }
}
Write-Host "Total files updated: $count"
