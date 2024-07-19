import matplotlib.pyplot as plt

# Data for the bar graph
labels = ['SiEBERT', 'Gemini', 'ChatGPT']
average_accuracies = [0.9524, 0.9143, 0.8571]

# Create a bar graph with light shades of red, blue, and green
fig, ax = plt.subplots()
bars = ax.bar(labels, average_accuracies, color=['lightblue', 'lightgreen', 'lightcoral'])

# Add labels and title
ax.set_ylabel('Average Accuracy')
ax.set_title('Comparison of Average Accuracies for Sentiment Analysis')
ax.set_ylim(0, 1)

# Add accuracy labels on top of each bar
for bar, accuracy in zip(bars, average_accuracies):
    height = bar.get_height()
    ax.annotate(f'{accuracy:.4f}', xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 3), textcoords="offset points", ha='center', va='bottom')

# Display the plot
plt.show()
