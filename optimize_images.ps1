<#
Optimize images in a folder using ImageMagick (magick).

Usage:
  .\optimize_images.ps1 -Source .\assests\images -Dest .\assests\images\optimized

Requirements: install ImageMagick (https://imagemagick.org) and ensure `magick` is in PATH.

This script will:
 - create destination folder
 - for each PNG/JPG: create a resized copy (max width 1600) and a WebP copy
 - keep originals untouched
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Source = "assests/images",
    [Parameter(Mandatory=$false)]
    [string]$Dest = "assests/images/optimized",
    [int]$MaxWidth = 1600
)

if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Error "ImageMagick 'magick' command is not available. Install ImageMagick: https://imagemagick.org"
    exit 1
}

if (-not (Test-Path $Source)) { Write-Error "Source path '$Source' not found"; exit 1 }
New-Item -ItemType Directory -Force -Path $Dest | Out-Null

Get-ChildItem -Path $Source -Include *.png,*.jpg,*.jpeg -File | ForEach-Object {
    $in = $_.FullName
    $base = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    $ext = $_.Extension.ToLower()
    $out = Join-Path $Dest ($base + $ext)
    $webp = Join-Path $Dest ($base + '.webp')

    Write-Host "Processing $($_.Name)..."
    # resize (only if larger)
    & magick "$in" -define jpeg:extent=900kb -resize ${MaxWidth}x "$out"
    # create webp
    & magick "$out" -quality 80 "$webp"
}

Write-Host "Done. Optimized images saved to: $Dest"
