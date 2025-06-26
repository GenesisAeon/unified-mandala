# Simple Neural Network example in R
library(tidyverse)
library(neuralnet)

# use built-in iris dataset
iris <- iris %>% mutate_if(is.character, as.factor)

# split data
set.seed(245)
train_idx <- sample(seq_len(nrow(iris)), size = 0.8 * nrow(iris))
train_data <- iris[train_idx, ]
test_data <- iris[-train_idx, ]

# build model with two hidden layers (4 and 2 neurons)
model <- neuralnet(Species ~ Sepal.Length + Sepal.Width + Petal.Length + Petal.Width,
                   data = train_data, hidden = c(4, 2), linear.output = FALSE)

# predict on test set
pred <- predict(model, test_data)
labels <- c("setosa", "versicolor", "virginica")
prediction_label <- apply(pred, 1, function(x) labels[which.max(x)])

# confusion matrix
table(test_data$Species, prediction_label)

# accuracy
accuracy <- mean(test_data$Species == prediction_label) * 100
print(accuracy)
