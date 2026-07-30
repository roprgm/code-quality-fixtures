import rewardkit as rk

rk.command_succeeds(
    "npm test && npm run typecheck",
    timeout=180,
    weight=4,
)
