import rewardkit as rk

rk.command_succeeds(
    "npm test && npm run typecheck && npm run build",
    timeout=180,
    weight=4,
)
