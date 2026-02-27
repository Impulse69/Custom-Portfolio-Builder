# Lessons Learned

1. **Port Management**: Whenever starting a local development server (e.g., on port 3000), always check for and terminate any existing processes running on that port first to prevent connection issues. On Windows PowerShell, use:
   `Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }`

## Troubleshooting
- If the browser subagent fails to connect to `localhost`, ensure that previous Node/Next.js processes have been fully terminated and that the dev server has finished compiling.
