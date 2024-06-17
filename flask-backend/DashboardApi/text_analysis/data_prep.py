import pandas as pd

# Load the CSV file with appropriate options to handle inconsistencies
file_path = 'osdg-community-data-v2024-04-01.csv'
output_path = 'cleaned_osdg_community_data.csv'

try:
    data = pd.read_csv(file_path, delimiter='\t', quoting=3, on_bad_lines='skip')
except Exception as e:
    print(f"Error loading the data: {e}")
    exit()

# Display the first few rows of the loaded data
print("First few rows of the dataset:")
print(data.head())

# Save the cleaned data to a new CSV file
data.to_csv(output_path, index=False)

print(f"Cleaned data has been saved to {output_path}")
