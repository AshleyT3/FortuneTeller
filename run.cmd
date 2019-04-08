REM Run from .\FortuneTeller
call npm install
if errorlevel 1 goto :error
call npm run tsc
if errorlevel 1 goto :error
call npm run fortuneTeller
if errorlevel 1 goto :error
goto :end
:error
Echo Failure.
