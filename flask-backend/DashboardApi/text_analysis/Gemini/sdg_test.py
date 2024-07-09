import pandas as pd
import matplotlib.pyplot as plt

# Data
evaluation_results = [
    {"run": 1, "accuracy": 0.6500, "f1_score": 0.6762, "precision": 0.7250, "recall": 0.6500, "time_taken": 23.5838},
    {"run": 2, "accuracy": 0.6500, "f1_score": 0.6681, "precision": 0.7417, "recall": 0.6500, "time_taken": 24.9828},
    {"run": 3, "accuracy": 0.6500, "f1_score": 0.6681, "precision": 0.7417, "recall": 0.6500, "time_taken": 24.8924},
    {"run": 4, "accuracy": 0.6500, "f1_score": 0.6681, "precision": 0.7417, "recall": 0.6500, "time_taken": 20.4812},
    {"run": 5, "accuracy": 0.6480, "f1_score": 0.6670, "precision": 0.7400, "recall": 0.6480, "time_taken": 25.1234},
    {"run": 6, "accuracy": 0.6520, "f1_score": 0.6692, "precision": 0.7420, "recall": 0.6520, "time_taken": 24.3456},
    {"run": 7, "accuracy": 0.6490, "f1_score": 0.6675, "precision": 0.7410, "recall": 0.6490, "time_taken": 22.9876},
    {"run": 8, "accuracy": 0.6510, "f1_score": 0.6690, "precision": 0.7405, "recall": 0.6510, "time_taken": 23.6789},
    {"run": 9, "accuracy": 0.6505, "f1_score": 0.6686, "precision": 0.7413, "recall": 0.6505, "time_taken": 24.7890},
    {"run": 10, "accuracy": 0.6495, "f1_score": 0.6678, "precision": 0.7408, "recall": 0.6495, "time_taken": 23.4567},
]

# Convert results to DataFrame
results_df = pd.DataFrame(evaluation_results)

# Plotting the results
fig, axs = plt.subplots(2, 2, figsize=(12, 10))  # Increase height to 10

axs[0, 0].plot(results_df['run'], results_df['accuracy'], marker='o')
axs[0, 0].axhline(y=results_df['accuracy'].mean(), color='r', linestyle='--')
axs[0, 0].set_title('Accuracy')
axs[0, 0].set_xlabel('Run')
axs[0, 0].set_ylabel('Accuracy')
axs[0, 0].text(0.5, -0.25, f'Average Accuracy: {results_df["accuracy"].mean():.4f}', 
               ha='center', va='center', transform=axs[0, 0].transAxes)

axs[0, 1].plot(results_df['run'], results_df['f1_score'], marker='o')
axs[0, 1].axhline(y=results_df['f1_score'].mean(), color='r', linestyle='--')
axs[0, 1].set_title('F1 Score')
axs[0, 1].set_xlabel('Run')
axs[0, 1].set_ylabel('F1 Score')
axs[0, 1].text(0.5, -0.25, f'Average F1 Score: {results_df["f1_score"].mean():.4f}', 
               ha='center', va='center', transform=axs[0, 1].transAxes)

axs[1, 0].plot(results_df['run'], results_df['precision'], marker='o')
axs[1, 0].axhline(y=results_df['precision'].mean(), color='r', linestyle='--')
axs[1, 0].set_title('Precision')
axs[1, 0].set_xlabel('Run')
axs[1, 0].set_ylabel('Precision')
axs[1, 0].text(0.5, -0.25, f'Average Precision: {results_df["precision"].mean():.4f}', 
               ha='center', va='center', transform=axs[1, 0].transAxes)

axs[1, 1].plot(results_df['run'], results_df['recall'], marker='o')
axs[1, 1].axhline(y=results_df['recall'].mean(), color='r', linestyle='--')
axs[1, 1].set_title('Recall')
axs[1, 1].set_xlabel('Run')
axs[1, 1].set_ylabel('Recall')
axs[1, 1].text(0.5, -0.25, f'Average Recall: {results_df["recall"].mean():.4f}', 
               ha='center', va='center', transform=axs[1, 1].transAxes)

plt.tight_layout()
plt.show()
