import pandas as pd

# Load the combined dataset
df_combined = pd.read_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/osdg_community_dataset_final.csv')

# Sample 10 rows for each SDG
df_sampled = df_combined.groupby('sdg').apply(lambda x: x.sample(50, random_state=42)).reset_index(drop=True)

# Save the sampled dataset to a new CSV file
df_sampled.to_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/osdg_community_dataset_sampled.csv', index=False)

# Display the shape and the first few rows of the sampled dataset
print('Shape of the sampled dataset:', df_sampled.shape)
print('First few rows of the sampled dataset:')
print(df_sampled.head())
