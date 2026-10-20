# MNIST sample provenance

`1-60716.png` is the unchanged 28×28 grayscale image at zero-based test index
716, with label 1, from the Keras MNIST archive:
https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz

The filename follows this deck's existing convention: label followed by
60000 + test index. The pixels were exported from `x_test[716]`; the label
was checked against `y_test[716]`. The top stroke illustrates why a simple
shape rule can confuse 1 and 7. The slide's prediction/correction sequence
is explanatory animation, not an inference result from a trained model.
