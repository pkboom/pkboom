# Run `python gh_workflow_run.py`
import os
import time

command = "gh workflow run update_readme.yml"

os.system(command)

time.sleep(1)

command = "gh run list --workflow=update_readme.yml --limit 1 --json status --jq '.[0].status'"

while True:
  output = os.popen(command).read().strip()

  if (output == "completed"):
    print('completed')
    break
  else:
    print('.', end='', flush=True)

  time.sleep(1)
