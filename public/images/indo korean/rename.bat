@echo off
setlocal EnableDelayedExpansion

set count=1

for %%f in (*.jpg *.jpeg *.png *.webp *.gif *.bmp *.tif *.tiff *.avif) do (
    set ext=%%~xf
    set num=00!count!
    ren "%%f" "!num:~-3!!ext!"
    set /a count+=1
)

echo Done!
pause
