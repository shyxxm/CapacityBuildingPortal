import matplotlib.pyplot as plt
import numpy as np

# Provided lists
accuracy_list = [0.8571428571428571] * 10
f1_list = [0.9221938775510203] * 10
precision_list = [1.0] * 10
recall_list = [0.8571428571428571] * 10

# Calculate average values
average_accuracy = np.mean(accuracy_list)
average_f1 = np.mean(f1_list)
average_precision = np.mean(precision_list)
average_recall = np.mean(recall_list)

# Data for bar plot
categories = ['Accuracy', 'F1 Score', 'Precision', 'Recall']
scores = [average_accuracy, average_f1, average_precision, average_recall]

# Color scheme
colors = ['#4c72b0', '#a6bddb', '#4c72b0', '#a6bddb']

# Plotting
plt.figure(figsize=(8, 6))
bars = plt.bar(categories, scores, color=colors)
plt.ylim(0, 1)

# Adding text on top of the bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width() / 2, height - 0.05, f'{height:.4f}', ha='center', color='white', fontsize=12)

plt.title('Average Scores Over 10 Runs')
plt.ylabel('Score')
plt.show()
