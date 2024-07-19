import matplotlib.pyplot as plt
import numpy as np

# Fake results as per your request
accuracy_list = [0.9047619047619048] * 6 + [1.0] + [0.9047619047619048] * 3
f1_list = [0.9482580911152338] * 6 + [1.0] + [0.9482580911152338] * 3
precision_list = [1.0] * 10
recall_list = [0.9047619047619048] * 6 + [1.0] + [0.9047619047619048] * 3

# Calculate average scores
average_accuracy = np.mean(accuracy_list)
average_f1 = np.mean(f1_list)
average_precision = np.mean(precision_list)
average_recall = np.mean(recall_list)

# Data for bar plot
categories = ['Accuracy', 'F1 Score', 'Precision', 'Recall']
average_scores = [average_accuracy, average_f1, average_precision, average_recall]

# Plotting the bar graph with the specified color scheme
plt.figure(figsize=(10, 6))
bars = plt.bar(categories, average_scores, color=['#4F81BD', '#95B3D7', '#4F81BD', '#95B3D7'], alpha=0.7)
plt.ylim(0, 1)
plt.title('Average Scores Over 10 Runs')
plt.ylabel('Score')

# Adding the text on top of the bars with improved visibility
for i, bar in enumerate(bars):
    yval = bar.get_height()
    color = 'black'  # Set the color to black for better visibility
    plt.text(bar.get_x() + bar.get_width() / 2, yval - 0.05, round(yval, 4), ha='center', va='bottom', color=color, fontsize=12)

plt.show()
