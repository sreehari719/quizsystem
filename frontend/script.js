/* =====================================================
   QUIZMASTER
   Complete Frontend Quiz Application
===================================================== */
const API_BASE_URL = "https://quizsystem-oc27.onrender.com";

/* ================= QUESTION DATABASE ================= */

const quizData = {

    programming: {

        easy: [
            {
                q: "Which language is mainly used for system programming?",
                options: ["C", "HTML", "CSS", "SQL"],
                answer: 0,
                explanation: "C is widely used for system programming because it provides low-level memory and hardware control."
            },
            {
                q: "Which data structure follows FIFO?",
                options: ["Stack", "Queue", "Tree", "Graph"],
                answer: 1,
                explanation: "FIFO means First In, First Out. A queue follows this principle."
            },
            {
                q: "Which symbol is commonly used for assignment in C?",
                options: ["==", "=", "!=", ">="],
                answer: 1,
                explanation: "The single equals sign assigns a value to a variable. Double equals is used for comparison."
            },
            {
                q: "Which loop executes while a condition is true?",
                options: ["while", "switch", "if", "case"],
                answer: 0,
                explanation: "The while loop repeatedly executes its body as long as its condition remains true."
            },
            {
                q: "Which is a valid C data type?",
                options: ["integer", "int", "number", "decimal"],
                answer: 1,
                explanation: "int is the standard C data type used to store integer values."
            },
            {
                q: "What is an array?",
                options: [
                    "Collection of similar elements",
                    "A single character",
                    "A function",
                    "A compiler"
                ],
                answer: 0,
                explanation: "An array stores multiple elements of the same data type under one variable name."
            },
            {
                q: "Which keyword is used to return a value from a function?",
                options: ["send", "return", "output", "value"],
                answer: 1,
                explanation: "The return keyword sends a value back from a function to its caller."
            },
            {
                q: "Which operator performs logical AND in C?",
                options: ["&&", "||", "!", "&"],
                answer: 0,
                explanation: "&& is the logical AND operator in C."
            },
            {
                q: "Which of these is a programming language?",
                options: ["Python", "Chrome", "Windows", "Photoshop"],
                answer: 0,
                explanation: "Python is a high-level programming language."
            },
            {
                q: "What does CPU stand for?",
                options: [
                    "Central Processing Unit",
                    "Computer Processing Utility",
                    "Central Program Unit",
                    "Computer Personal Unit"
                ],
                answer: 0,
                explanation: "CPU stands for Central Processing Unit, the main processing component of a computer."
            }
        ],

        medium: [
            {
                q: "What is the time complexity of binary search?",
                options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                answer: 1,
                explanation: "Binary search repeatedly divides the search space in half, giving O(log n) complexity."
            },
            {
                q: "Which data structure is commonly used for recursion?",
                options: ["Queue", "Stack", "Array", "Graph"],
                answer: 1,
                explanation: "Function calls are stored in the call stack, which manages recursive function execution."
            },
            {
                q: "What does a pointer store?",
                options: [
                    "A memory address",
                    "Only characters",
                    "A function result",
                    "A keyword"
                ],
                answer: 0,
                explanation: "A pointer stores the memory address of another variable or object."
            },
            {
                q: "Which sorting algorithm has average O(n log n) complexity?",
                options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Linear Search"],
                answer: 2,
                explanation: "Merge Sort divides the data recursively and merges sorted parts, giving O(n log n)."
            },
            {
                q: "What is recursion?",
                options: [
                    "A function calling itself",
                    "A loop only",
                    "A variable declaration",
                    "A data type"
                ],
                answer: 0,
                explanation: "Recursion occurs when a function calls itself to solve smaller versions of a problem."
            },
            {
                q: "Which structure represents hierarchical data?",
                options: ["Queue", "Stack", "Tree", "Array"],
                answer: 2,
                explanation: "Trees represent hierarchical relationships such as folders and organizational structures."
            },
            {
                q: "Which traversal visits left subtree, root, then right subtree?",
                options: ["Preorder", "Inorder", "Postorder", "Level order"],
                answer: 1,
                explanation: "Inorder traversal follows Left → Root → Right."
            },
            {
                q: "What is encapsulation mainly associated with?",
                options: [
                    "Combining data and methods",
                    "Deleting data",
                    "Sorting data",
                    "Compiling code"
                ],
                answer: 0,
                explanation: "Encapsulation bundles data and the methods operating on that data into a single unit."
            },
            {
                q: "Which memory is generally fastest?",
                options: ["Hard disk", "RAM", "Cache", "USB"],
                answer: 2,
                explanation: "Cache memory is designed to provide very fast access to frequently used data."
            },
            {
                q: "What does an algorithm provide?",
                options: [
                    "Step-by-step solution",
                    "Only source code",
                    "Only hardware",
                    "Only data"
                ],
                answer: 0,
                explanation: "An algorithm is a finite sequence of steps used to solve a problem."
            }
        ],

        hard: [
            {
                q: "What is the worst-case time complexity of quicksort?",
                options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
                answer: 2,
                explanation: "Quicksort can become O(n²) when partitions are highly unbalanced."
            },
            {
                q: "Which algorithm finds shortest paths from a source with non-negative edge weights?",
                options: ["DFS", "Dijkstra", "Kruskal", "Binary Search"],
                answer: 1,
                explanation: "Dijkstra's algorithm finds shortest paths from a source when edge weights are non-negative."
            },
            {
                q: "What is the space complexity of recursive factorial with n calls?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                answer: 2,
                explanation: "Each recursive call occupies stack space, resulting in O(n) space."
            },
            {
                q: "Which traversal can be used to detect cycles in a directed graph?",
                options: ["DFS", "Binary Search", "Bubble Sort", "Merge Sort"],
                answer: 0,
                explanation: "DFS can detect back edges, which indicate cycles in directed graphs."
            },
            {
                q: "What is the main purpose of dynamic programming?",
                options: [
                    "Avoid repeated subproblems",
                    "Increase memory errors",
                    "Remove functions",
                    "Compile faster"
                ],
                answer: 0,
                explanation: "Dynamic programming stores solutions to overlapping subproblems so they don't need to be recomputed."
            },
            {
                q: "Which algorithm is commonly used to construct a minimum spanning tree?",
                options: ["Kruskal", "Binary Search", "BFS", "KMP"],
                answer: 0,
                explanation: "Kruskal's algorithm constructs a minimum spanning tree by selecting edges in increasing weight order."
            },
            {
                q: "What does Big-O notation describe?",
                options: [
                    "Growth of resource usage",
                    "Programming language",
                    "Variable type",
                    "Compiler version"
                ],
                answer: 0,
                explanation: "Big-O describes how time or space requirements grow as input size increases."
            },
            {
                q: "Which data structure is ideal for priority-based removal?",
                options: ["Heap", "Stack", "Array", "String"],
                answer: 0,
                explanation: "A heap efficiently supports insertion and removal based on priority."
            },
            {
                q: "Which technique breaks a problem into smaller independent parts?",
                options: [
                    "Divide and conquer",
                    "Linear scanning",
                    "Casting",
                    "Compilation"
                ],
                answer: 0,
                explanation: "Divide and conquer splits a problem into smaller subproblems, solves them, and combines their results."
            },
            {
                q: "What is the worst-case search time in a balanced binary search tree?",
                options: ["O(1)", "O(log n)", "O(n²)", "O(2ⁿ)"],
                answer: 1,
                explanation: "A balanced binary search tree has height O(log n), so search takes O(log n)."
            }
        ]
    },


    python: {

        easy: [
            {
                q: "Which symbol is used to start a comment in Python?",
                options: ["//", "#", "/*", "--"],
                answer: 1,
                explanation: "Python uses # at the beginning of a line to create a comment."
            },
            {
                q: "Which function displays output?",
                options: ["display()", "print()", "show()", "output()"],
                answer: 1,
                explanation: "The print() function displays output on the screen."
            },
            {
                q: "Which is a Python list?",
                options: ["[1, 2, 3]", "{1,2,3}", "(1,2,3)", "<1,2,3>"],
                answer: 0,
                explanation: "Square brackets are used to create Python lists."
            },
            {
                q: "Which keyword defines a function?",
                options: ["function", "def", "fun", "define"],
                answer: 1,
                explanation: "Python uses the def keyword to define a function."
            },
            {
                q: "Which data type stores True or False?",
                options: ["int", "str", "bool", "float"],
                answer: 2,
                explanation: "The bool data type represents True and False values."
            },
            {
                q: "Which extension is normally used for Python files?",
                options: [".java", ".py", ".html", ".cpp"],
                answer: 1,
                explanation: "Python source files normally use the .py extension."
            },
            {
                q: "Which keyword creates a loop over items?",
                options: ["for", "repeat", "loop", "iterate"],
                answer: 0,
                explanation: "The for statement is commonly used to iterate over a sequence."
            },
            {
                q: "Which collection cannot be modified after creation?",
                options: ["List", "Tuple", "Dictionary", "Set"],
                answer: 1,
                explanation: "Tuples are immutable, meaning their elements cannot be changed after creation."
            },
            {
                q: "Which function returns the length of a list?",
                options: ["count()", "length()", "len()", "size()"],
                answer: 2,
                explanation: "The built-in len() function returns the number of items."
            },
            {
                q: "Python is mainly what type of language?",
                options: ["High-level", "Machine", "Assembly", "Hardware"],
                answer: 0,
                explanation: "Python is a high-level programming language designed for readability and productivity."
            }
        ],

        medium: [
            {
                q: "What does a dictionary store?",
                options: [
                    "Key-value pairs",
                    "Only numbers",
                    "Only strings",
                    "Only functions"
                ],
                answer: 0,
                explanation: "Python dictionaries store information as key-value pairs."
            },
            {
                q: "What does list slicing return?",
                options: [
                    "A portion of a list",
                    "Only one variable",
                    "A function",
                    "A class"
                ],
                answer: 0,
                explanation: "Slicing creates a selected portion of an existing sequence."
            },
            {
                q: "Which keyword handles exceptions?",
                options: ["try", "catch", "handle", "error"],
                answer: 0,
                explanation: "Python uses try together with except to handle exceptions."
            },
            {
                q: "Which keyword creates an anonymous function?",
                options: ["lambda", "anonymous", "function", "def"],
                answer: 0,
                explanation: "The lambda keyword creates a small anonymous function."
            },
            {
                q: "What does append() do?",
                options: [
                    "Adds an item to a list",
                    "Deletes a list",
                    "Sorts a list",
                    "Copies a list"
                ],
                answer: 0,
                explanation: "append() adds one item to the end of a list."
            },
            {
                q: "What is indentation used for in Python?",
                options: [
                    "Defining code blocks",
                    "Adding comments",
                    "Declaring variables",
                    "Importing modules"
                ],
                answer: 0,
                explanation: "Python uses indentation to define blocks of code."
            },
            {
                q: "Which keyword imports a module?",
                options: ["include", "import", "using", "module"],
                answer: 1,
                explanation: "Python uses import to bring a module into a program."
            },
            {
                q: "What does range(5) normally generate?",
                options: [
                    "0 through 4",
                    "1 through 5",
                    "0 through 5",
                    "1 through 4"
                ],
                answer: 0,
                explanation: "range(5) produces values starting at 0 and ending before 5."
            },
            {
                q: "Which method removes and returns the last list item?",
                options: ["remove()", "delete()", "pop()", "clear()"],
                answer: 2,
                explanation: "pop() removes and returns an item, with the default being the last item."
            },
            {
                q: "Which library is widely used for numerical arrays?",
                options: ["NumPy", "Flask", "Django", "Tkinter"],
                answer: 0,
                explanation: "NumPy provides efficient numerical arrays and mathematical operations."
            }
        ],

        hard: [
            {
                q: "Which object type is immutable?",
                options: ["List", "Dictionary", "Tuple", "Set"],
                answer: 2,
                explanation: "Tuples are immutable objects in Python."
            },
            {
                q: "What does a Python generator primarily provide?",
                options: [
                    "Lazy iteration",
                    "Database storage",
                    "GUI design",
                    "Compilation"
                ],
                answer: 0,
                explanation: "Generators produce values lazily, which can reduce memory usage."
            },
            {
                q: "Which keyword is used to create a generator value?",
                options: ["yield", "generate", "returning", "lazy"],
                answer: 0,
                explanation: "The yield keyword turns a function into a generator."
            },
            {
                q: "What is the purpose of a decorator?",
                options: [
                    "Modify or extend function behavior",
                    "Create hardware",
                    "Delete variables",
                    "Compile Python"
                ],
                answer: 0,
                explanation: "Decorators wrap functions or classes to extend or modify their behavior."
            },
            {
                q: "What is a list comprehension?",
                options: [
                    "Compact way to create lists",
                    "A database query",
                    "A compiler",
                    "A class constructor"
                ],
                answer: 0,
                explanation: "List comprehensions provide a concise way to create lists from iterable data."
            },
            {
                q: "Which module supports regular expressions?",
                options: ["regex", "re", "pattern", "match"],
                answer: 1,
                explanation: "Python's re module provides regular-expression operations."
            },
            {
                q: "What does *args allow?",
                options: [
                    "Variable positional arguments",
                    "Variable classes",
                    "Only strings",
                    "Only keyword arguments"
                ],
                answer: 0,
                explanation: "*args allows a function to accept a variable number of positional arguments."
            },
            {
                q: "What does **kwargs allow?",
                options: [
                    "Variable keyword arguments",
                    "Only integers",
                    "Variable lists",
                    "Only positional arguments"
                ],
                answer: 0,
                explanation: "**kwargs allows a function to accept a variable number of keyword arguments."
            },
            {
                q: "Which structure provides average O(1) key lookup?",
                options: ["Dictionary", "List", "Tuple", "String"],
                answer: 0,
                explanation: "Python dictionaries use hash tables and provide average O(1) key lookup."
            },
            {
                q: "What is PEP 8?",
                options: [
                    "Python style guide",
                    "Python compiler",
                    "Python database",
                    "Python framework"
                ],
                answer: 0,
                explanation: "PEP 8 provides conventions and recommendations for writing readable Python code."
            }
        ]
    },


    java: {

        easy: [
            {
                q: "Who originally developed Java?",
                options: ["Sun Microsystems", "Microsoft", "Apple", "IBM"],
                answer: 0,
                explanation: "Java was originally developed at Sun Microsystems."
            },
            {
                q: "Which keyword creates an object?",
                options: ["create", "new", "object", "make"],
                answer: 1,
                explanation: "The new keyword creates an instance of a class."
            },
            {
                q: "Which method is the entry point of a Java application?",
                options: ["start()", "main()", "run()", "execute()"],
                answer: 1,
                explanation: "The main() method is the standard entry point for a Java application."
            },
            {
                q: "Which keyword defines a class?",
                options: ["class", "Class", "define", "object"],
                answer: 0,
                explanation: "The class keyword is used to declare a class."
            },
            {
                q: "Which type stores whole numbers?",
                options: ["int", "float", "char", "boolean"],
                answer: 0,
                explanation: "The int type stores 32-bit signed integer values."
            },
            {
                q: "Which symbol ends most Java statements?",
                options: [".", ";", ":", ","],
                answer: 1,
                explanation: "Most Java statements end with a semicolon."
            },
            {
                q: "Which keyword inherits a class?",
                options: ["inherits", "extends", "implements", "super"],
                answer: 1,
                explanation: "The extends keyword is used for class inheritance."
            },
            {
                q: "Which type stores true or false?",
                options: ["bool", "boolean", "bit", "logical"],
                answer: 1,
                explanation: "Java uses the boolean type for true and false values."
            },
            {
                q: "Java source files normally use which extension?",
                options: [".java", ".class", ".js", ".jav"],
                answer: 0,
                explanation: "Java source code files use the .java extension."
            },
            {
                q: "Which company acquired Sun Microsystems?",
                options: ["Oracle", "Google", "Amazon", "Meta"],
                answer: 0,
                explanation: "Oracle acquired Sun Microsystems in 2010."
            }
        ],

        medium: [
            {
                q: "What is method overloading?",
                options: [
                    "Same method name with different parameters",
                    "Deleting a method",
                    "Creating a package",
                    "Hiding a class"
                ],
                answer: 0,
                explanation: "Method overloading allows multiple methods with the same name but different parameter lists."
            },
            {
                q: "What is method overriding?",
                options: [
                    "Subclass redefining inherited behavior",
                    "Creating variables",
                    "Overloading constructors",
                    "Deleting methods"
                ],
                answer: 0,
                explanation: "Overriding occurs when a subclass provides its own implementation of an inherited method."
            },
            {
                q: "Which collection does not allow duplicate elements?",
                options: ["List", "Set", "ArrayList", "Vector"],
                answer: 1,
                explanation: "The Set interface represents collections that do not allow duplicate elements."
            },
            {
                q: "Which keyword prevents inheritance?",
                options: ["static", "final", "private", "protected"],
                answer: 1,
                explanation: "A final class cannot be extended."
            },
            {
                q: "What is an interface mainly used for?",
                options: [
                    "Defining a contract",
                    "Storing files",
                    "Creating databases",
                    "Compiling code"
                ],
                answer: 0,
                explanation: "Interfaces define a contract of methods that implementing classes must provide."
            },
            {
                q: "Which exception is checked at compile time?",
                options: [
                    "Checked exception",
                    "Runtime exception",
                    "Error",
                    "Logical exception"
                ],
                answer: 0,
                explanation: "Checked exceptions must be handled or declared by the compiler."
            },
            {
                q: "Which collection stores key-value pairs?",
                options: ["List", "Set", "Map", "Queue"],
                answer: 2,
                explanation: "Map collections store associations between keys and values."
            },
            {
                q: "What does JVM stand for?",
                options: [
                    "Java Virtual Machine",
                    "Java Variable Method",
                    "Java Visual Machine",
                    "Java Version Manager"
                ],
                answer: 0,
                explanation: "JVM stands for Java Virtual Machine."
            },
            {
                q: "What does JDK contain?",
                options: [
                    "Development tools and JRE",
                    "Only browser",
                    "Only JVM",
                    "Only source code"
                ],
                answer: 0,
                explanation: "The JDK provides Java development tools and includes the components needed to run Java applications."
            },
            {
                q: "Which keyword refers to the current object?",
                options: ["self", "this", "current", "object"],
                answer: 1,
                explanation: "The this keyword refers to the current object."
            }
        ],

        hard: [
            {
                q: "Which memory area stores objects in Java?",
                options: ["Stack", "Heap", "Register", "Code cache"],
                answer: 1,
                explanation: "Objects created with new are allocated in the heap."
            },
            {
                q: "Which concept allows one interface to have multiple implementations?",
                options: ["Polymorphism", "Encapsulation", "Compilation", "Casting"],
                answer: 0,
                explanation: "Polymorphism allows the same interface to be used with different implementations."
            },
            {
                q: "What does garbage collection do?",
                options: [
                    "Reclaims unused objects",
                    "Compiles source code",
                    "Creates classes",
                    "Starts threads"
                ],
                answer: 0,
                explanation: "Java's garbage collector automatically reclaims memory occupied by unreachable objects."
            },
            {
                q: "Which collection is generally suitable for fast random access by index?",
                options: ["ArrayList", "HashSet", "TreeSet", "HashMap"],
                answer: 0,
                explanation: "ArrayList provides efficient indexed access."
            },
            {
                q: "What does synchronized help control?",
                options: [
                    "Concurrent access",
                    "File extension",
                    "Class inheritance",
                    "Compilation"
                ],
                answer: 0,
                explanation: "synchronized can control access to shared resources among multiple threads."
            },
            {
                q: "Which interface represents a task that returns a result?",
                options: ["Runnable", "Callable", "Thread", "Executor"],
                answer: 1,
                explanation: "Callable represents a task that can return a result and throw an exception."
            },
            {
                q: "Which mechanism enables multiple inheritance of type in Java?",
                options: [
                    "Interfaces",
                    "Classes",
                    "Constructors",
                    "Packages"
                ],
                answer: 0,
                explanation: "A Java class can implement multiple interfaces, allowing multiple inheritance of type."
            },
            {
                q: "Which Map implementation generally provides average O(1) lookup?",
                options: ["HashMap", "TreeMap", "LinkedList", "TreeSet"],
                answer: 0,
                explanation: "HashMap provides average constant-time key lookup based on hashing."
            },
            {
                q: "What does final on a variable generally mean?",
                options: [
                    "It cannot be reassigned",
                    "It must be private",
                    "It becomes static",
                    "It becomes a method"
                ],
                answer: 0,
                explanation: "A final variable can be assigned only once."
            },
            {
                q: "Which principle hides internal implementation details?",
                options: [
                    "Encapsulation",
                    "Inheritance",
                    "Recursion",
                    "Compilation"
                ],
                answer: 0,
                explanation: "Encapsulation hides internal state and implementation details behind a controlled interface."
            }
        ]
    },


    aiml: {

        easy: [
            {
                q: "What does AI stand for?",
                options: [
                    "Artificial Intelligence",
                    "Automated Internet",
                    "Advanced Information",
                    "Artificial Integration"
                ],
                answer: 0,
                explanation: "AI stands for Artificial Intelligence, the field of creating systems that perform tasks requiring intelligence."
            },
            {
                q: "What does ML stand for?",
                options: [
                    "Machine Learning",
                    "Memory Logic",
                    "Machine Language",
                    "Model Logic"
                ],
                answer: 0,
                explanation: "ML stands for Machine Learning."
            },
            {
                q: "Which is a supervised learning task?",
                options: [
                    "Classification",
                    "Clustering",
                    "Dimensionality reduction",
                    "Association mining"
                ],
                answer: 0,
                explanation: "Classification learns from labeled examples, making it a supervised learning task."
            },
            {
                q: "What is training data?",
                options: [
                    "Data used to learn model parameters",
                    "Only test results",
                    "Database software",
                    "A programming language"
                ],
                answer: 0,
                explanation: "Training data is used by a machine learning algorithm to learn patterns and parameters."
            },
            {
                q: "Which is an example of AI?",
                options: [
                    "Voice assistant",
                    "Simple calculator",
                    "USB cable",
                    "Keyboard"
                ],
                answer: 0,
                explanation: "Voice assistants use AI techniques such as speech recognition and natural language processing."
            },
            {
                q: "Which learning uses labeled data?",
                options: ["Supervised", "Unsupervised", "Random", "Manual"],
                answer: 0,
                explanation: "Supervised learning uses labeled training examples."
            },
            {
                q: "Which algorithm is used for classification?",
                options: [
                    "Decision Tree",
                    "File Explorer",
                    "Compiler",
                    "Router"
                ],
                answer: 0,
                explanation: "Decision trees can be used for classification and regression."
            },
            {
                q: "What is a model in machine learning?",
                options: [
                    "Learned representation used for predictions",
                    "Only a dataset",
                    "A computer monitor",
                    "A keyboard"
                ],
                answer: 0,
                explanation: "A machine learning model represents patterns learned from data and can be used for prediction."
            },
            {
                q: "Which field deals with understanding human language?",
                options: [
                    "NLP",
                    "Networking",
                    "Operating Systems",
                    "Databases"
                ],
                answer: 0,
                explanation: "Natural Language Processing, or NLP, deals with processing and understanding human language."
            },
            {
                q: "Which is an example of unsupervised learning?",
                options: [
                    "Clustering",
                    "Classification",
                    "Regression with labels",
                    "Spam labeling"
                ],
                answer: 0,
                explanation: "Clustering finds groups in data without requiring predefined labels."
            }
        ],

        medium: [
            {
                q: "What is overfitting?",
                options: [
                    "Model performs well on training data but poorly on unseen data",
                    "Model never learns",
                    "Dataset has no values",
                    "Model has no parameters"
                ],
                answer: 0,
                explanation: "Overfitting occurs when a model learns training-specific patterns too closely and generalizes poorly."
            },
            {
                q: "What is a feature?",
                options: [
                    "Input variable used by a model",
                    "Model output only",
                    "Programming language",
                    "Database server"
                ],
                answer: 0,
                explanation: "A feature is an input variable or measurable characteristic used by a machine learning model."
            },
            {
                q: "What does accuracy measure?",
                options: [
                    "Fraction of predictions that are correct",
                    "Training time",
                    "Number of features",
                    "Memory usage"
                ],
                answer: 0,
                explanation: "Accuracy is the proportion of predictions that are correct among all predictions."
            },
            {
                q: "Which technique can reduce overfitting?",
                options: [
                    "Regularization",
                    "Removing all data",
                    "Increasing errors",
                    "Ignoring validation"
                ],
                answer: 0,
                explanation: "Regularization penalizes overly complex models and can improve generalization."
            },
            {
                q: "What is a confusion matrix used for?",
                options: [
                    "Evaluating classification",
                    "Compiling programs",
                    "Storing images",
                    "Sorting arrays"
                ],
                answer: 0,
                explanation: "A confusion matrix summarizes predicted versus actual classes for classification."
            },
            {
                q: "What is regression used to predict?",
                options: [
                    "Continuous values",
                    "Only categories",
                    "Only images",
                    "Only text"
                ],
                answer: 0,
                explanation: "Regression models predict numerical continuous outcomes."
            },
            {
                q: "What is an epoch?",
                options: [
                    "One complete pass through training data",
                    "One feature",
                    "One neuron",
                    "One test example"
                ],
                answer: 0,
                explanation: "An epoch is one complete pass through the training dataset."
            },
            {
                q: "What does normalization commonly do?",
                options: [
                    "Rescales features",
                    "Deletes labels",
                    "Creates hardware",
                    "Compiles models"
                ],
                answer: 0,
                explanation: "Normalization rescales numerical features to a common range or scale."
            },
            {
                q: "Which algorithm is commonly used for clustering?",
                options: [
                    "K-Means",
                    "Linear Regression",
                    "Logistic Regression",
                    "Decision Tree"
                ],
                answer: 0,
                explanation: "K-Means is a popular unsupervised clustering algorithm."
            },
            {
                q: "What is a validation set used for?",
                options: [
                    "Model selection and tuning",
                    "Final deployment only",
                    "Replacing training data",
                    "Writing source code"
                ],
                answer: 0,
                explanation: "Validation data helps compare models and tune hyperparameters before final testing."
            }
        ],

        hard: [
            {
                q: "What does gradient descent minimize during training?",
                options: [
                    "Loss function",
                    "Dataset size",
                    "Number of classes",
                    "Input dimensions"
                ],
                answer: 0,
                explanation: "Gradient descent updates model parameters in a direction that reduces the loss function."
            },
            {
                q: "What is precision in binary classification?",
                options: [
                    "TP / (TP + FP)",
                    "TP / (TP + FN)",
                    "(TP + TN) / Total",
                    "FP / Total"
                ],
                answer: 0,
                explanation: "Precision measures how many predicted positives are actually positive: TP divided by TP plus FP."
            },
            {
                q: "What is recall?",
                options: [
                    "TP / (TP + FN)",
                    "TP / (TP + FP)",
                    "TN / Total",
                    "FP / Total"
                ],
                answer: 0,
                explanation: "Recall measures how many actual positives are correctly identified."
            },
            {
                q: "What does dropout do in neural networks?",
                options: [
                    "Randomly disables units during training",
                    "Adds more labels",
                    "Deletes the dataset",
                    "Increases every weight"
                ],
                answer: 0,
                explanation: "Dropout randomly disables selected units during training to reduce overfitting."
            },
            {
                q: "What is the purpose of an activation function?",
                options: [
                    "Introduce non-linearity",
                    "Store datasets",
                    "Sort features",
                    "Create hardware"
                ],
                answer: 0,
                explanation: "Activation functions introduce non-linearity, allowing neural networks to learn complex relationships."
            },
            {
                q: "What does CNN commonly process effectively?",
                options: [
                    "Images",
                    "Only databases",
                    "Only spreadsheets",
                    "Only source code"
                ],
                answer: 0,
                explanation: "Convolutional neural networks are especially effective for image and spatial data."
            },
            {
                q: "What is an embedding?",
                options: [
                    "Dense numerical representation of data",
                    "A database password",
                    "A compiler",
                    "A hardware device"
                ],
                answer: 0,
                explanation: "Embeddings represent items such as words or images as numerical vectors that capture useful relationships."
            },
            {
                q: "What is data leakage?",
                options: [
                    "Information from outside training improperly influences training",
                    "Deleting data",
                    "Compressing data",
                    "Normalizing data"
                ],
                answer: 0,
                explanation: "Data leakage occurs when information that should be unavailable during training influences the model."
            },
            {
                q: "What does PCA primarily perform?",
                options: [
                    "Dimensionality reduction",
                    "Classification only",
                    "Database indexing",
                    "Web hosting"
                ],
                answer: 0,
                explanation: "Principal Component Analysis transforms data into fewer dimensions while retaining important variance."
            },
            {
                q: "What is the purpose of a test set?",
                options: [
                    "Final evaluation on unseen data",
                    "Training model parameters",
                    "Choosing every feature",
                    "Creating labels"
                ],
                answer: 0,
                explanation: "A test set provides an unbiased final evaluation after model development and tuning."
            }
        ]
    },


    web: {

        easy: [
            {
                q: "Which language structures web pages?",
                options: ["HTML", "CSS", "JavaScript", "Python"],
                answer: 0,
                explanation: "HTML provides the structure and content of web pages."
            },
            {
                q: "Which language styles web pages?",
                options: ["HTML", "CSS", "Java", "SQL"],
                answer: 1,
                explanation: "CSS controls the presentation and styling of web pages."
            },
            {
                q: "Which language adds browser interactivity?",
                options: ["CSS", "HTML", "JavaScript", "SQL"],
                answer: 2,
                explanation: "JavaScript is used to add dynamic behavior and interactivity in browsers."
            },
            {
                q: "Which HTML tag creates a hyperlink?",
                options: ["<p>", "<a>", "<img>", "<div>"],
                answer: 1,
                explanation: "The <a> element is used to create hyperlinks."
            },
            {
                q: "Which HTML tag displays an image?",
                options: ["<image>", "<img>", "<picturefile>", "<photo>"],
                answer: 1,
                explanation: "The <img> element embeds an image in an HTML document."
            },
            {
                q: "Which CSS property changes text color?",
                options: ["font", "text-color", "color", "background"],
                answer: 2,
                explanation: "The CSS color property controls the foreground text color."
            },
            {
                q: "What does URL stand for?",
                options: [
                    "Uniform Resource Locator",
                    "Universal Resource Link",
                    "User Resource Location",
                    "Uniform Routing Link"
                ],
                answer: 0,
                explanation: "URL stands for Uniform Resource Locator."
            },
            {
                q: "Which HTML element creates a paragraph?",
                options: ["<p>", "<para>", "<text>", "<paragraph>"],
                answer: 0,
                explanation: "The <p> element represents a paragraph."
            },
            {
                q: "Which symbol selects a class in CSS?",
                options: ["#", ".", "@", "&"],
                answer: 1,
                explanation: "A period selects a class selector in CSS."
            },
            {
                q: "Which symbol selects an ID in CSS?",
                options: [".", "#", "@", "*"],
                answer: 1,
                explanation: "The # symbol selects an element by its ID."
            }
        ],

        medium: [
            {
                q: "What does responsive design mean?",
                options: [
                    "Design adapts to different screen sizes",
                    "Website loads only once",
                    "Using only JavaScript",
                    "Using no CSS"
                ],
                answer: 0,
                explanation: "Responsive design allows layouts to adapt to different devices and screen sizes."
            },
            {
                q: "Which CSS layout system is useful for one-dimensional layouts?",
                options: ["Flexbox", "FTP", "SQL", "JSON"],
                answer: 0,
                explanation: "Flexbox is designed primarily for one-dimensional row or column layouts."
            },
            {
                q: "Which CSS layout system is useful for two-dimensional layouts?",
                options: ["Grid", "FTP", "HTTP", "DOM"],
                answer: 0,
                explanation: "CSS Grid is designed for two-dimensional row and column layouts."
            },
            {
                q: "What does DOM stand for?",
                options: [
                    "Document Object Model",
                    "Data Object Method",
                    "Document Order Model",
                    "Digital Object Manager"
                ],
                answer: 0,
                explanation: "DOM stands for Document Object Model and represents the page as a tree of objects."
            },
            {
                q: "Which method selects an element by ID?",
                options: [
                    "getElementById",
                    "selectID",
                    "getID",
                    "findElement"
                ],
                answer: 0,
                explanation: "document.getElementById() selects an element using its ID."
            },
            {
                q: "Which HTTP method is commonly used to retrieve data?",
                options: ["GET", "POST", "DELETE", "PATCH"],
                answer: 0,
                explanation: "GET is commonly used to request or retrieve resources."
            },
            {
                q: "Which HTTP status means Not Found?",
                options: ["200", "301", "404", "500"],
                answer: 2,
                explanation: "HTTP 404 means the requested resource could not be found."
            },
            {
                q: "What is JSON commonly used for?",
                options: [
                    "Data interchange",
                    "Styling",
                    "Image editing",
                    "Compiling CSS"
                ],
                answer: 0,
                explanation: "JSON is widely used to represent and exchange structured data."
            },
            {
                q: "What does API stand for?",
                options: [
                    "Application Programming Interface",
                    "Application Page Internet",
                    "Advanced Program Input",
                    "Automatic Programming Internet"
                ],
                answer: 0,
                explanation: "API stands for Application Programming Interface."
            },
            {
                q: "Which storage API stores data in the browser persistently?",
                options: ["localStorage", "console", "DOM", "windowName"],
                answer: 0,
                explanation: "localStorage stores key-value data in the browser and persists across sessions."
            }
        ],

        hard: [
            {
                q: "What is event bubbling?",
                options: [
                    "Event moves from target toward ancestors",
                    "Event is deleted",
                    "CSS animation",
                    "Server restart"
                ],
                answer: 0,
                explanation: "In event bubbling, an event propagates from the target element upward through its ancestors."
            },
            {
                q: "What does CORS control?",
                options: [
                    "Cross-origin browser requests",
                    "CSS colors",
                    "Database tables",
                    "HTML headings"
                ],
                answer: 0,
                explanation: "CORS controls whether browsers allow web pages to make requests across origins."
            },
            {
                q: "Which status code indicates successful creation?",
                options: ["200", "201", "204", "404"],
                answer: 1,
                explanation: "HTTP 201 Created indicates that a resource was successfully created."
            },
            {
                q: "What is asynchronous JavaScript useful for?",
                options: [
                    "Handling operations without blocking the main flow",
                    "Changing HTML syntax",
                    "Removing CSS",
                    "Compiling Java"
                ],
                answer: 0,
                explanation: "Asynchronous operations allow tasks such as network requests to proceed without blocking normal execution."
            },
            {
                q: "What does HTTPS add to HTTP?",
                options: [
                    "Encrypted communication",
                    "HTML support",
                    "CSS support",
                    "Database tables"
                ],
                answer: 0,
                explanation: "HTTPS uses TLS to protect communication between the browser and server."
            },
            {
                q: "What is REST primarily an approach to?",
                options: [
                    "Designing network APIs",
                    "Styling websites",
                    "Writing CSS",
                    "Editing images"
                ],
                answer: 0,
                explanation: "REST is an architectural style commonly used for designing web APIs."
            },
            {
                q: "What is debouncing useful for?",
                options: [
                    "Reducing repeated rapid function calls",
                    "Encrypting passwords",
                    "Creating HTML",
                    "Storing images"
                ],
                answer: 0,
                explanation: "Debouncing delays execution until rapid repeated events stop, reducing unnecessary calls."
            },
            {
                q: "Which security issue involves injecting malicious scripts into pages?",
                options: ["XSS", "DNS", "FTP", "CORS"],
                answer: 0,
                explanation: "Cross-Site Scripting, or XSS, involves injecting executable malicious content into web pages."
            },
            {
                q: "What is a promise in JavaScript?",
                options: [
                    "Object representing eventual completion or failure",
                    "HTML element",
                    "CSS selector",
                    "Database table"
                ],
                answer: 0,
                explanation: "A Promise represents the eventual completion or failure of an asynchronous operation."
            },
            {
                q: "Which mechanism can prevent default browser behavior?",
                options: [
                    "preventDefault()",
                    "stopBrowser()",
                    "cancelDefault()",
                    "preventBrowser()"
                ],
                answer: 0,
                explanation: "event.preventDefault() prevents the browser's default action for an event."
            }
        ]
    }
};


/* =====================================================
   GENERAL TOPICS
===================================================== */

quizData.gk = createGeneralQuestions();
quizData.math = createMathQuestions();
quizData.science = createScienceQuestions();


/* ================= GLOBAL VARIABLES ================= */

let currentUser = null;

let currentQuestions = [];

let currentQuestionIndex = 0;

let selectedAnswer = null;

let score = 0;

let timeLeft = 60;

let timer = null;

let currentTopic = "";

let currentDifficulty = "";


/* ================= AUTH ================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("quizUsers") || "{}"
    );

}



async function register() {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!username || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (username.length < 3 || username.length > 30) {
        alert("Username must contain 3–30 characters.");
        return;
    }

    if (password.length < 8 || password.length > 128) {
        alert("Password must contain 8–128 characters.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Registration failed.");
            return;
        }

        alert("Registration successful! Please log in.");
        document.getElementById("login-username").value = username;
        document.getElementById("login-password").value = "";
        showLogin();
    } catch (error) {
        console.error("Registration error:", error);
        alert("Unable to connect to the server. Please try again.");
    }
}

async function login() {
    const username = document
        .getElementById("login-username").value.trim();

    const password = document
        .getElementById("login-password").value;

    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail || "Login failed. Check your credentials.");
            return;
        }

        if (!data.token) {
            alert("Login response did not contain an access token.");
            return;
        }

        localStorage.setItem("accessToken", data.token);
        localStorage.setItem(
            "loggedInUser",
            data.user.username
        );

        currentUser = data.user.username;

        showDashboard();

    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to the server. Please try again.");
    }
}

function logout() {

    clearInterval(timer);

    localStorage.removeItem("loggedInUser");

    currentUser = null;

    document.getElementById("dashboard-page")
        .classList.add("hidden");

    document.getElementById("quiz-page")
        .classList.add("hidden");

    document.getElementById("result-page")
        .classList.add("hidden");

    document.getElementById("auth-page")
        .classList.remove("hidden");

}


function showRegister() {

    document.getElementById("login-box")
        .classList.add("hidden");

    document.getElementById("register-box")
        .classList.remove("hidden");

}


function showLogin() {

    document.getElementById("register-box")
        .classList.add("hidden");

    document.getElementById("login-box")
        .classList.remove("hidden");

}


/* ================= DASHBOARD ================= */

function showDashboard() {

    document.getElementById("auth-page")
        .classList.add("hidden");

    document.getElementById("quiz-page")
        .classList.add("hidden");

    document.getElementById("result-page")
        .classList.add("hidden");

    document.getElementById("dashboard-page")
        .classList.remove("hidden");


    document.getElementById("dashboard-user")
        .textContent = currentUser;

    document.getElementById("nav-user")
        .textContent = currentUser;


    updateDashboard();

}



async function updateDashboard() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert("Please log in again.");
        logout();
        return;
    }

    const headers = {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
    };

    try {
        const [meResponse, progressResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/me`, { headers }),
            fetch(`${API_BASE_URL}/api/progress`, { headers })
        ]);

        const me = await meResponse.json();
        const progressData = await progressResponse.json();

        if (!meResponse.ok) {
            throw new Error(me.detail || "Unable to load profile.");
        }

        if (!progressResponse.ok) {
            throw new Error(
                progressData.detail || "Unable to load progress."
            );
        }

        document.getElementById("total-quizzes").textContent =
            me.completed_quizzes ?? 0;

        document.getElementById("best-score").textContent =
            `${me.best_score ?? 0} pts`;

        const completed = me.completed_quizzes ?? 0;
        const points = me.total_points ?? 0;

        document.getElementById("average-score").textContent =
            completed ? `${Math.round(points / completed)} pts` : "0 pts";

        const container = document.getElementById("history-list");
        container.replaceChildren();

        const progress = progressData.progress || [];

        if (progress.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-history";
            message.textContent = "No completed levels yet.";
            container.appendChild(message);
            return;
        }

        progress.forEach(item => {
            const row = document.createElement("div");
            row.className = "history-item";

            const details = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = item.language;

            const level = document.createElement("small");
            level.textContent =
                `Level ${item.level} · ${item.attempts} attempt(s)`;

            details.append(title, level);

            const result = document.createElement("div");
            result.className = "history-score";
            result.textContent = `${item.best_score ?? 0} pts`;

            row.append(details, result);
            container.appendChild(row);
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        document.getElementById("history-list").textContent =
            "Unable to load your progress. Please refresh and try again.";
    }
}



function displayHistory(history) {

    const container =
        document.getElementById("history-list");


    if (!history.length) {

        container.innerHTML =
            `<p class="empty-history">
                No quizzes attempted yet.
            </p>`;

        return;

    }


    container.innerHTML = "";


    history
        .slice()
        .reverse()
        .slice(0, 5)
        .forEach(item => {

            const div =
                document.createElement("div");

            div.className = "history-item";

            div.innerHTML = `

                <div>

                    <strong>
                        ${item.topic}
                    </strong>

                    <small>
                        ${item.difficulty}
                    </small>

                </div>

                <div class="history-score">
                    ${item.percentage}%
                </div>

            `;

            container.appendChild(div);

        });

}


/* ================= START QUIZ ================= */

function startQuiz() {

    currentTopic =
        document.getElementById("topic").value;

    currentDifficulty =
        document.getElementById("difficulty").value;


    currentQuestions =
        quizData[currentTopic][currentDifficulty];


    currentQuestionIndex = 0;

    score = 0;


    document.getElementById("dashboard-page")
        .classList.add("hidden");

    document.getElementById("quiz-page")
        .classList.remove("hidden");


    document.getElementById("quiz-topic")
        .textContent =
        getTopicName(currentTopic);


    showQuestion();

}


function showQuestion() {

    selectedAnswer = null;

    timeLeft = 60;


    clearInterval(timer);


    document.getElementById("time")
        .textContent = timeLeft;


    document.getElementById("question-number")
        .textContent =
        `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;


    document.getElementById("difficulty-label")
        .textContent =
        capitalize(currentDifficulty);


    document.getElementById("progress-bar")
        .style.width =
        `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;


    const question =
        currentQuestions[currentQuestionIndex];


    document.getElementById("question")
        .textContent = question.q;


    const optionsContainer =
        document.getElementById("options");


    optionsContainer.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const div =
                document.createElement("div");

            div.className = "option";

            div.textContent = option;


            div.onclick = () => {

                selectAnswer(div, index);

            };


            optionsContainer.appendChild(div);

        }
    );


    startQuestionTimer();

}


/* ================= TIMER ================= */

function startQuestionTimer() {

    const timerElement =
        document.querySelector(".timer");


    timerElement.classList.remove("warning");


    timer = setInterval(() => {

        timeLeft--;


        document.getElementById("time")
            .textContent = timeLeft;


        if (timeLeft <= 10) {

            timerElement.classList.add("warning");

        }


        if (timeLeft <= 0) {

            clearInterval(timer);

            handleTimeUp();

        }

    }, 1000);

}


function handleTimeUp() {

    selectedAnswer = null;

    const question =
        currentQuestions[currentQuestionIndex];


    showExplanation(
        null,
        question.answer,
        question.explanation,
        true
    );

}


/* ================= ANSWER ================= */

function selectAnswer(element, index) {

    const options =
        document.querySelectorAll(".option");


    options.forEach(option => {

        option.classList.remove("selected");

    });


    element.classList.add("selected");

    selectedAnswer = index;

}


function nextQuestion() {

    if (selectedAnswer === null) {

        alert("Please select an answer.");

        return;

    }


    clearInterval(timer);


    const question =
        currentQuestions[currentQuestionIndex];


    if (selectedAnswer === question.answer) {

        score++;

        goToNextQuestion();

    } else {

        showExplanation(
            selectedAnswer,
            question.answer,
            question.explanation,
            false
        );

    }

}


/* ================= EXPLANATION ================= */

function showExplanation(
    userAnswer,
    correctAnswer,
    explanation,
    timedOut
) {

    document.getElementById("explanation-modal")
        .classList.remove("hidden");


    document.getElementById("bot-result")
        .textContent =
        timedOut
            ? "⏰ Time's Up!"
            : "❌ That's not correct";


    if (timedOut) {

        document.getElementById("user-answer")
            .textContent =
            "You did not select an answer.";

    } else {

        document.getElementById("user-answer")
            .textContent =
            currentQuestions[currentQuestionIndex]
                .options[userAnswer];

    }


    document.getElementById("correct-answer")
        .textContent =
        currentQuestions[currentQuestionIndex]
            .options[correctAnswer];


    document.getElementById("explanation")
        .textContent = explanation;

}


function closeExplanation() {

    document.getElementById("explanation-modal")
        .classList.add("hidden");


    goToNextQuestion();

}


function goToNextQuestion() {

    currentQuestionIndex++;


    if (
        currentQuestionIndex >=
        currentQuestions.length
    ) {

        finishQuiz();

    } else {

        showQuestion();

    }

}


/* ================= FINISH QUIZ ================= */

function finishQuiz() {

    clearInterval(timer);


    const total =
        currentQuestions.length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    const wrong =
        total - score;


    saveResult(percentage);


    document.getElementById("quiz-page")
        .classList.add("hidden");

    document.getElementById("result-page")
        .classList.remove("hidden");


    document.getElementById("result-user")
        .textContent = currentUser;


    document.getElementById("final-score")
        .textContent = percentage + "%";


    document.getElementById("correct-count")
        .textContent = score;


    document.getElementById("wrong-count")
        .textContent = wrong;


    document.getElementById("final-total")
        .textContent = total;


    let message;


    if (percentage >= 90) {

        message =
            "Outstanding! You're a QuizMaster! 🏆";

    } else if (percentage >= 75) {

        message =
            "Excellent work! Keep going! 🎉";

    } else if (percentage >= 50) {

        message =
            "Good effort! You can improve further. 💪";

    } else {

        message =
            "Keep practicing. You will get better! 📚";

    }


    document.getElementById("result-message")
        .textContent = message;

}


/* ================= SAVE RESULT ================= */

function saveResult(percentage) {

    const users = getUsers();


    users[currentUser].history.push({

        topic:
            getTopicName(currentTopic),

        difficulty:
            capitalize(currentDifficulty),

        percentage:
            percentage,

        score:
            score,

        date:
            new Date().toLocaleDateString()

    });


    localStorage.setItem(
        "quizUsers",
        JSON.stringify(users)
    );

}


/* ================= RETRY ================= */

function retryQuiz() {

    document.getElementById("result-page")
        .classList.add("hidden");

    document.getElementById("quiz-page")
        .classList.remove("hidden");


    currentQuestionIndex = 0;

    score = 0;

    showQuestion();

}


function goDashboard() {

    document.getElementById("result-page")
        .classList.add("hidden");

    showDashboard();

}


/* ================= UTILITIES ================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}


function getTopicName(topic) {

    const names = {

        programming: "Programming",

        python: "Python",

        java: "Java",

        aiml: "AI & ML",

        web: "Web Development",

        gk: "General Knowledge",

        math: "Mathematics",

        science: "Science"

    };


    return names[topic];

}


/* =====================================================
   GENERAL KNOWLEDGE QUESTIONS
===================================================== */

function createGeneralQuestions() {

    return {

        easy: [

            {
                q: "What is the capital of India?",
                options: ["Mumbai", "New Delhi", "Chennai", "Kolkata"],
                answer: 1,
                explanation: "New Delhi is the capital of India."
            },

            {
                q: "Which planet is known as the Red Planet?",
                options: ["Earth", "Mars", "Venus", "Jupiter"],
                answer: 1,
                explanation: "Mars appears reddish because of iron minerals on its surface."
            },

            {
                q: "How many days are there in a leap year?",
                options: ["364", "365", "366", "367"],
                answer: 2,
                explanation: "A leap year has 366 days."
            },

            {
                q: "Which is the largest ocean?",
                options: ["Atlantic", "Indian", "Pacific", "Arctic"],
                answer: 2,
                explanation: "The Pacific Ocean is the largest ocean on Earth."
            },

            {
                q: "Which gas do humans need for respiration?",
                options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
                answer: 0,
                explanation: "Humans require oxygen for aerobic cellular respiration."
            },

            {
                q: "Which is the largest continent?",
                options: ["Africa", "Asia", "Europe", "Australia"],
                answer: 1,
                explanation: "Asia is the largest continent by area."
            },

            {
                q: "How many colors are traditionally in a rainbow?",
                options: ["5", "6", "7", "8"],
                answer: 2,
                explanation: "The traditional description identifies seven rainbow colors."
            },

            {
                q: "Which is the fastest land animal?",
                options: ["Lion", "Cheetah", "Horse", "Tiger"],
                answer: 1,
                explanation: "The cheetah is the fastest land animal."
            },

            {
                q: "Which instrument measures temperature?",
                options: ["Barometer", "Thermometer", "Hygrometer", "Compass"],
                answer: 1,
                explanation: "A thermometer measures temperature."
            },

            {
                q: "How many continents are commonly recognized?",
                options: ["5", "6", "7", "8"],
                answer: 2,
                explanation: "The commonly taught model recognizes seven continents."
            }

        ],

        medium: [],
        hard: []

    };

}


/* =====================================================
   MATHEMATICS
===================================================== */

function createMathQuestions() {

    const easy = [

        {
            q: "What is 12 × 5?",
            options: ["50", "60", "70", "80"],
            answer: 1,
            explanation: "12 multiplied by 5 equals 60."
        },

        {
            q: "What is 100 ÷ 4?",
            options: ["20", "25", "30", "40"],
            answer: 1,
            explanation: "100 divided by 4 equals 25."
        },

        {
            q: "What is 15 + 27?",
            options: ["40", "41", "42", "43"],
            answer: 2,
            explanation: "15 + 27 = 42."
        },

        {
            q: "What is 9²?",
            options: ["18", "72", "81", "90"],
            answer: 2,
            explanation: "9 × 9 = 81."
        },

        {
            q: "What is half of 50?",
            options: ["20", "25", "30", "35"],
            answer: 1,
            explanation: "50 divided by 2 equals 25."
        },

        {
            q: "What is 7 × 8?",
            options: ["54", "56", "58", "64"],
            answer: 1,
            explanation: "7 × 8 = 56."
        },

        {
            q: "What is 20% of 100?",
            options: ["10", "20", "30", "40"],
            answer: 1,
            explanation: "20% of 100 is 20."
        },

        {
            q: "What is the square root of 64?",
            options: ["6", "7", "8", "9"],
            answer: 2,
            explanation: "8 × 8 = 64."
        },

        {
            q: "What is 3 + 4 × 2?",
            options: ["14", "11", "10", "8"],
            answer: 1,
            explanation: "Multiplication is performed first: 4 × 2 = 8, then 3 + 8 = 11."
        },

        {
            q: "What is 1 kilometer in meters?",
            options: ["10", "100", "1000", "10000"],
            answer: 2,
            explanation: "1 kilometer equals 1000 meters."
        }

    ];

    return {

        easy: easy,

        medium: easy.map(q => ({
            ...q,
            q: "Medium: " + q.q
        })),

        hard: easy.map(q => ({
            ...q,
            q: "Hard: " + q.q
        }))

    };

}


/* =====================================================
   SCIENCE
===================================================== */

function createScienceQuestions() {

    const easy = [

        {
            q: "What is the chemical formula of water?",
            options: ["CO2", "H2O", "O2", "NaCl"],
            answer: 1,
            explanation: "Water consists of two hydrogen atoms and one oxygen atom, written as H2O."
        },

        {
            q: "Which organ pumps blood?",
            options: ["Lungs", "Brain", "Heart", "Kidney"],
            answer: 2,
            explanation: "The heart pumps blood throughout the body."
        },

        {
            q: "Which planet is closest to the Sun?",
            options: ["Venus", "Earth", "Mercury", "Mars"],
            answer: 2,
            explanation: "Mercury is the closest planet to the Sun."
        },

        {
            q: "What force pulls objects toward Earth?",
            options: ["Friction", "Gravity", "Magnetism", "Pressure"],
            answer: 1,
            explanation: "Gravity attracts objects toward Earth's center."
        },

        {
            q: "Which gas do plants absorb during photosynthesis?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
            answer: 2,
            explanation: "Plants absorb carbon dioxide during photosynthesis."
        },

        {
            q: "What is the basic unit of life?",
            options: ["Atom", "Cell", "Organ", "Tissue"],
            answer: 1,
            explanation: "The cell is considered the basic structural and functional unit of life."
        },

        {
            q: "What is the boiling point of water at standard pressure?",
            options: ["50°C", "75°C", "100°C", "150°C"],
            answer: 2,
            explanation: "Water boils at 100°C at standard atmospheric pressure."
        },

        {
            q: "Which vitamin is commonly produced in skin through sunlight exposure?",
            options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
            answer: 3,
            explanation: "Sunlight exposure helps the skin synthesize vitamin D."
        },

        {
            q: "Which part of a plant absorbs water?",
            options: ["Flower", "Roots", "Fruit", "Leaf"],
            answer: 1,
            explanation: "Roots absorb water and minerals from the soil."
        },

        {
            q: "What is Earth's natural satellite?",
            options: ["Mars", "Sun", "Moon", "Venus"],
            answer: 2,
            explanation: "The Moon is Earth's natural satellite."
        }

    ];

    return {

        easy: easy,

        medium: easy.map(q => ({
            ...q,
            q: "Medium: " + q.q
        })),

        hard: easy.map(q => ({
            ...q,
            q: "Hard: " + q.q
        }))

    };

}


/* =====================================================
   AUTO LOGIN
===================================================== */

window.onload = function () {

    const loggedUser =
        localStorage.getItem("loggedInUser");


    if (loggedUser) {

        const users = getUsers();


        if (users[loggedUser]) {

            currentUser = loggedUser;

            showDashboard();

        }

    }

};
