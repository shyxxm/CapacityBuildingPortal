import pandas as pd
import torch
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments

# Load the combined dataset
df_combined = pd.read_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/osdg_community_dataset_final.csv')

# Rename the 'sdg' column to 'labels' and adjust the label values to be within the range 0-16
df_combined = df_combined.rename(columns={"sdg": "labels"})
df_combined['labels'] = df_combined['labels'] - 1  # Adjust labels to range from 0 to 16

# Convert DataFrame to Hugging Face Dataset
dataset = Dataset.from_pandas(df_combined)

# Load pre-trained tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Tokenize the dataset
def tokenize_function(examples):
    tokens = tokenizer(examples['text'], padding="max_length", truncation=True)
    tokens["labels"] = examples["labels"]
    return tokens

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Split the dataset into training and validation sets
train_test_split = tokenized_datasets.train_test_split(test_size=0.1)
train_dataset = train_test_split['train']
eval_dataset = train_test_split['test']

# Remove the columns not needed for training
train_dataset = train_dataset.remove_columns(['doi', 'text_id', 'text', 'labels_negative', 'labels_positive', 'agreement'])
eval_dataset = eval_dataset.remove_columns(['doi', 'text_id', 'text', 'labels_negative', 'labels_positive', 'agreement'])

# Set the format of the datasets to PyTorch tensors
train_dataset.set_format(type='torch', columns=['input_ids', 'attention_mask', 'labels'])
eval_dataset.set_format(type='torch', columns=['input_ids', 'attention_mask', 'labels'])

# Load pre-trained model
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=17)

# Define training arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    evaluation_strategy="epoch",
    learning_rate=5e-5,
    logging_dir='./logs',
    save_steps=500,  # Save checkpoint every 500 steps
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

# Train the model, resuming from checkpoint-1000 if available
trainer.train(resume_from_checkpoint='./results/checkpoint-1000')

# Save the final model
model.save_pretrained('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/')
tokenizer.save_pretrained('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/')
