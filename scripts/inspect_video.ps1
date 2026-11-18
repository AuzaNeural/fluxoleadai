$path = "$env:USERPROFILE\.gemini\antigravity\brain\f0f51e9a-f2d5-49d8-9c3b-5a5c4cb9ee8a\.user_uploaded\media_1794973633192_471a10fd.mp4"
$folder = Split-Path $path
$file = Split-Path $path -Leaf
$shell = New-Object -ComObject Shell.Application
$shellFolder = $shell.Namespace($folder)
$shellFile = $shellFolder.ParseName($file)

0..50 | ForEach-Object {
    $name = $shellFolder.GetDetailsOf($null, $_)
    $val = $shellFolder.GetDetailsOf($shellFile, $_)
    if ($val) {
        Write-Host "$name : $val"
    }
}
