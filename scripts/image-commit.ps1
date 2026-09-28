# VETRI KALAM — commits the staged artwork rendered by scripts/gen-images.mjs
# into public\images\ using the original filenames and formats.
#
#   powershell -ExecutionPolicy Bypass -File scripts\image-commit.ps1
#
# Reads the spec list from gen-images.mjs --list (index => file), takes
# %TEMP%\vk-imagegen\final{index}.png and writes:
#     *.jpg  -> JPEG (quality 85)
#     *.png  -> PNG (byte copy)
# then re-opens every target to confirm the pixel dimensions match the spec.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$node = 'D:\NodeJS\node.exe'
if (-not (Test-Path $node)) { $node = 'node' }
$tmp = Join-Path $env:TEMP 'vk-imagegen'

Write-Output "project : $root"
Write-Output "staging : $tmp"
Write-Output ''

$specLines = & $node (Join-Path $root 'scripts\gen-images.mjs') --list 2>&1
if ($LASTEXITCODE -ne 0) { throw "gen-images.mjs --list failed:`n$specLines" }

$specs = @()
foreach ($line in $specLines) {
    if ($line -notmatch '^images/') { continue }
    $bits = $line -split "`t"
    if ($bits.Count -lt 2) { continue }
    $dim = $bits[1] -split 'x'
    $specs += [pscustomobject]@{
        rel  = $bits[0]
        w    = [int]$dim[0]
        h    = [int]$dim[1]
        scene = $bits[2]
    }
}
Write-Output ("specs found: " + $specs.Count)

# JPEG encoder
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$quality = New-Object System.Drawing.Imaging.EncoderParameters(1)
$quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

$ok = 0; $missing = @(); $bad = @()
for ($i = 0; $i -lt $specs.Count; $i++) {
    $s = $specs[$i]
    $src = Join-Path $tmp ("final{0}.png" -f $i)
    $targetRel = $s.rel -replace '^images/', ''
    $target = Join-Path (Join-Path $root 'public\images') $targetRel

    if (-not (Test-Path $src)) { $missing += ($s.rel + '  (no staged render at ' + $src + ')'); continue }

    $dir = Split-Path -Parent $target
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    try {
        if ($s.rel -match '\.jpg$') {
            $bmp = [System.Drawing.Image]::FromFile($src)
            $bmp.Save($target, $jpeg, $quality)
            $bmp.Dispose()
        } else {
            Copy-Item -Path $src -Destination $target -Force
        }

        $check = [System.Drawing.Image]::FromFile($target)
        if ($check.Width -ne $s.w -or $check.Height -ne $s.h) {
            $bad += ($s.rel + '  expected ' + $s.w + 'x' + $s.h + ' got ' + $check.Width + 'x' + $check.Height)
        }
        $check.Dispose()
        $ok++
    } catch {
        $bad += ($s.rel + '  ' + $_.Exception.Message)
    }

    if (($i + 1) % 20 -eq 0) { Write-Output ("  committed " + ($i + 1) + "/" + $specs.Count) }
}

Write-Output ''
Write-Output ("committed OK : " + $ok + "/" + $specs.Count)
if ($missing.Count) { Write-Output 'MISSING STAGED RENDERS:'; $missing | ForEach-Object { Write-Output ('  ' + $_) } }
if ($bad.Count) { Write-Output 'PROBLEMS:'; $bad | ForEach-Object { Write-Output ('  ' + $_) } }
if ($ok -eq $specs.Count -and $bad.Count -eq 0) { exit 0 } else { exit 1 }
