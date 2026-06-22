# Generates placeholder JPG/PNG assets for public/assets/ when originals are unavailable.
param(
    [string]$AssetsDir = (Join-Path $PSScriptRoot "..\public\assets")
)

Add-Type -AssemblyName System.Drawing

$AssetsDir = [System.IO.Path]::GetFullPath($AssetsDir)
New-Item -ItemType Directory -Force -Path $AssetsDir | Out-Null

$Bg = [System.Drawing.Color]::FromArgb(255, 26, 26, 46)
$Gold = [System.Drawing.Color]::FromArgb(255, 201, 162, 39)
$Muted = [System.Drawing.Color]::FromArgb(255, 160, 160, 176)

function Write-PlaceholderImage {
    param(
        [string]$OutputPath,
        [string]$Label,
        [int]$Width = 1200,
        [int]$Height = 800,
        [ValidateSet('Jpeg', 'Png')]
        [string]$Format = 'Jpeg',
        [int]$FontSize = 36
    )

    $bmp = New-Object System.Drawing.Bitmap $Width, $Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear($Bg)

    $font = New-Object System.Drawing.Font 'Segoe UI', $FontSize, [System.Drawing.FontStyle]::Bold
    $brush = New-Object System.Drawing.SolidBrush $Gold
    $subFont = New-Object System.Drawing.Font 'Segoe UI', [Math]::Max(14, [int]($FontSize * 0.45))
    $subBrush = New-Object System.Drawing.SolidBrush $Muted

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $titleRect = New-Object System.Drawing.RectangleF 40, ($Height / 2) - 40, ($Width - 80), 80
    $subRect = New-Object System.Drawing.RectangleF 40, ($Height / 2) + 36, ($Width - 80), 40

    $g.DrawString($Label, $font, $brush, $titleRect, $sf)
    $g.DrawString('Placeholder — replace with production asset', $subFont, $subBrush, $subRect, $sf)

    $g.Dispose()
    $font.Dispose()
    $subFont.Dispose()
    $brush.Dispose()
    $subBrush.Dispose()

    if ($Format -eq 'Jpeg') {
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
            Where-Object { $_.MimeType -eq 'image/jpeg' }
        $params = New-Object System.Drawing.Imaging.EncoderParameters 1
        $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter (
            [System.Drawing.Imaging.Encoder]::Quality, 85L
        )
        $bmp.Save($OutputPath, $encoder, $params)
    }
    else {
        $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }

    $bmp.Dispose()
    Write-Host "Created $OutputPath"
}

$photos = @(
    @{ Name = 'live-crowd.jpg'; Label = 'Live Crowd' },
    @{ Name = 'twy-live1.jpg'; Label = 'TWY Live' },
    @{ Name = 'bw-barn-band.jpg'; Label = 'Barn Band' },
    @{ Name = 'bw-duo.jpg'; Label = 'Duo Performance' },
    @{ Name = 'vocal-green.jpg'; Label = 'Lead Vocals' },
    @{ Name = 'band-barn-group.jpg'; Label = 'Band Group' },
    @{ Name = 'longhorn-sign.jpg'; Label = 'Longhorn Sign' },
    @{ Name = 'bw-guitar-case.jpg'; Label = 'Guitar Case' },
    @{ Name = 'bw-pedals.jpg'; Label = 'Stage Pedals' },
    @{ Name = 'band-wall.jpg'; Label = 'Band Wall' },
    @{ Name = 'band-tree1.jpg'; Label = 'Band Portrait' },
    @{ Name = 'band-tree2.jpg'; Label = 'Band Member'; Height = 1000 }
)

foreach ($photo in $photos) {
    $height = if ($photo.Height) { $photo.Height } else { 800 }
    Write-PlaceholderImage -OutputPath (Join-Path $AssetsDir $photo.Name) -Label $photo.Label -Height $height
}

Write-PlaceholderImage -OutputPath (Join-Path $AssetsDir 'twyicon.png') -Label 'TWY' -Width 84 -Height 84 -Format Png -FontSize 22
Write-PlaceholderImage -OutputPath (Join-Path $AssetsDir 'logo-twy.png') -Label 'Texas, Whiskey & You' -Width 320 -Height 96 -Format Png -FontSize 18

Write-Host "Done. Assets in $AssetsDir"
