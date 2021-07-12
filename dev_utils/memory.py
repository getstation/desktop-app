import psutil
import sys
import pandas as pd
import math

pid = int(sys.argv[1])

proc = psutil.Process(pid)

processes = [proc, ] +proc.children()

data = [ {
    'name': p.name(),
    'pid': p.pid,
    'rss': p.memory_info().rss,
    'vms': p.memory_info().vms
} for p in processes]


df = pd.DataFrame(data);


df['rss (MB)'] = df['rss'] / math.pow(10, 6)
df['vms (MB)'] = df['vms'] / math.pow(10, 6)
print df

print df.sum()
