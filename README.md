# Travelling Salesman Problem Visualiser

Welcome to the Travelling Salesman Problem Visualiser! I built this app with my friend [Justin Liu](https://github.com/juicetinliu) purely out of curiosity for computer science and software engineering. We hope you have fun with our creation!

## What is the Travelling Salesman Problem?

The travelling salesman problem is a very simple problem to explain, but an *extremely* difficult problem to solve efficiently. In computer science, this problem is classified as an *NP-Hard* problem, meaning that it cannot be solved in polynomial time or better, and a potentially optimal route cannot be verified as optimal in polynomial time or better.

A traveller has several cities (nodes/vertices) he/she would like to visit.
The traveller must visit all nodes exactly once and return to the original node (this is known as a Hamiltonian Cycle), and the goal is to find the path that minimises the traveller's total distance travelled.

## Summary of Algorithms

### Brute Force Algorithms

Brute Force Algorithms attempt to find the exact solution by checking all possible paths. These algorithms typically becomes impractical quite quickly as the number of cities increases.

##### Depth First Search
- This algorithm traverses each possible cycle in a *depth first search* manner, continuing until all possible paths are checked.
- The length of each cycle is calculated, and the cycle of mininum length is saved.
  
##### Branch and Bound
- Traverses in the same manner as *depth first search* but with a small optimisation
- If the current distance of a sub-path already exceeds the previous minimum of a full cycle, the remaining branches in this subtree are skipped as they cannot contain a full cycle with a shorter distance than the previous minimum distance cycle.

##### Random Search
- As the name suggests, this algorithm simply initialises Hamiltonian cycles randomly amongst the points, and calculates the path's corresponding distance.
- This algorithm will run endlessly until stopped!

### Heuristic Algorithms

Heuristic algorithms do not guarantee an optimal cycle, but aim to find a close approximation to the theoretical optimal route in significantly less time. These algorithms can be completed in *polynomial time*.

##### Nearest Neighbour
- The *greedy* approach. 
- The algorithm initialises a random starting node, and at each timestep searches for the closest node to the previous node that is not already part of the cycle and connects a path between the two nodes, until a complete cycle is formed.

##### Nearest Insertion, Farthest Insertion and Arbitrary Insertion
- These algorithms all begin in the same fashion: a random starting node is selected and connected to its nearest neighbouring node to form the first path.
- Now, the algorithms search for a new node to add to the cycle. For *nearest insertion*, the *closest* node to any in-cycle node is selected. For *farthest insertion*, the *farthest* node is selected, and for *arbitrary insertion* a *random* node is selected.
- The selected node is *inserted* between two other connected nodes where the *path distance increase* from the insertion is *minimised*. This repeats until all nodes have been inserted into the cycle.

##### Convex Hull
- First, the algorithm forms a subtour in the shape of a *convex hull*, the smallest convex polygon which encloses all points.
- For every node not in the sub-tour, find the *minimum cost insertion* possible with the node.
- Comparing these point insertions, find the one that minimises a cost function and make the insertion. Repeat this until the full cycle is formed.

## Thank You for Using our Application!
