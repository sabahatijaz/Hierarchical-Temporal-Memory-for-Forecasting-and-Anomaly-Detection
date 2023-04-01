import os
from glob import glob
import pandas as pd
PATH = r"C:\Users\User\Downloads\files\files"
EXT = "*.csv"
all_csv_files = [file
                 for path, subdir, files in os.walk(PATH)
                 for file in glob(os.path.join(path, EXT))]
print(all_csv_files)
#combine all files in the list
combined_csv = pd.concat([pd.read_csv(f) for f in all_csv_files ])
#export to csv
combined_csv.to_csv( r"C:\Users\User\Downloads\files\files\combined_csv.csv")
