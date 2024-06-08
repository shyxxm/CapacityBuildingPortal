import pandas as pd
from sklearn.model_selection import train_test_split

# Load the combined dataset
df_combined = pd.read_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/osdg_community_dataset_final.csv')

# Split the dataset into training and testing sets
train_df, test_df = train_test_split(df_combined, test_size=0.1, random_state=42, stratify=df_combined['sdg'])

# Save the training and testing sets
train_df.to_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sdg_train_dataset.csv', index=False)
test_df.to_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sdg_test_dataset.csv', index=False)

print("Training and testing datasets for SDG classification saved.")
