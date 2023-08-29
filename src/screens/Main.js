import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../store";
import { useNavigation } from "@react-navigation/native";
import {
  getDatabase,
  off,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  push,
  ref,
  serverTimestamp,
  set,
  get,
  child,
} from "firebase/database";
import { database } from "../firebase";
import{ ImagesAssets } from "../assets/ImageAssets";

const Main = () => {
  const [posts, setPosts] = useState([]); 
  const [sortedPosts, setSortedPosts] = useState([]); // Posts sortieren
  const [message, setMessage] = useState("");
  const { user, setUser } = useContext(AppContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (user === null) {
      navigation.navigate("Login");
    }
  }, [user]);

  const handlePost = () => {
    if (message === "") return;

    try {
      const db = getDatabase();

      const postRef = ref(db, "posts");

      const newPostRef = push(postRef);

      set(newPostRef, {
        uid: user.uid,
        message,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          console.log("Post created successfully!");
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleEditClick = (post) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, editing: true } : { ...p, editing: false }
      )
    );
  };

  const handleSaveClick = (post) => {
    // Update post content and timestamp in the state
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              editing: false,
              message: p.editedMessage,
              editedMessage: "",
              timestamp: Date.now(),
            }
          : p
      )
    );
  };

  const handleCancelEdit = (post) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, editing: false, editedMessage: "" }
          : p
      )
    );
  };


  const renderPost = ({ item, index }) => {
    return (
      <View
        style={[
          styles.post,
          item.editing ? styles.editingPost : null,
        ]}
      >
     <View style={styles.postHeader}>
        <Text style={styles.postDate}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.postUid}>{item.uid}</Text>
      </View>

        {item.editing ? (
        <View>
          <TextInput
            style={styles.editInput}
            value={item.editedMessage}
            onChangeText={(text) =>
              setPosts((prev) =>
                prev.map((post) =>
                  post.id === item.id
                    ? { ...post, editedMessage: text }
                    : post
                )
              )
            }
            />
            
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSaveClick(item)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelEdit(item)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text>{item.message}</Text>
      )}
      <View style={styles.buttonsContainer}>
        {item.editing ? null : (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditClick(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          )}
          
      </View>

      </View>
    );
  };

  useEffect(() => {
    const db = getDatabase();

    const postsRef = ref(db, "posts/");


    onChildAdded(postsRef, (snapshot) => {
      setPosts((prev) => [
        {
          id: snapshot.key,
          editing: false,
          editedMessage: "",
          ...snapshot.val(),
        },
        ...prev,
      ]);
    });
    onChildChanged(postsRef, (snapshot) => {
      const changedPost = {
        id: snapshot.key,
        editing: false,
        editedMessage: "",
        ...snapshot.val(),
      };

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === changedPost.id) {
            return changedPost;
          }
          return post;
        })
      );
    });
    onChildRemoved(postsRef, (snapshot) => {
      setPosts((prev) => prev.filter((post) => post.id !== snapshot.key));
    });

    return () => {
      off(postsRef, "child_added");
      off(postsRef, "child_changed");
      off(postsRef, "child_removed");
    };
  }, []);

    // Update sortedPosts whenever posts changes
    useEffect(() => {
      const sortedArray = [...posts].sort((a, b) => b.timestamp - a.timestamp);
      setSortedPosts(sortedArray);
    }, [posts]);

  return (
    <ImageBackground
      source={ImagesAssets.bannerList2}
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <View style={styles.signoutBtnContainer}>
        <Button title="Logout" onPress={handleLogout} color="black"/>
      </View>
      <Text style={styles.h1}>HOME</Text>

      <View>
        <TextInput
          multiline={true}
          style={styles.messageInput}
          placeholder="Enter Message"
          onChangeText={(value) => setMessage(value)}
          />
          <View style={styles.button}>
            <Button title="POST" onPress={handlePost} color="black" style={styles.buttonStyle} />
          </View>
      </View>
        <View>
             <Text style={styles.h2}>Posts</Text>
        <FlatList data={posts} renderItem={renderPost} />
      </View>
    </View>
    </ImageBackground>
  );
};

export default Main;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },

  container: {
    padding: 40,
    marginTop: 40,
  },

  signoutBtnContainer: {
    position: "absolute",
    right: 20,
    top: 20,
    
  },
  h1: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: 600,
    marginBottom: 50,
    color: "white",
  },
  h2: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 50,
    marginTop: 30,
    borderBottomWidth: 1,
    borderColor: "#f7dcf6",
    paddingBottom: 8,
    color: "white",
  },
  post: {
    borderBottomWidth: 1,
    padding: 20,
    borderColor: "white",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  postDate: {
    fontWeight: "600",
    marginRight: 8,
  },

  messageInput: {
    padding: 12,
    borderWidth: 2,
    height: 100,
    marginHorizontal: 10,
    borderColor: "white",
    borderRadius: 8,
    color:"black",
  },

  buttonStyle: {
    backgroundColor: "black",
    width: "80%",
  },

  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "black",
    padding: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  editButton: {
    margin: 10,
  },
  editButtonText: {
    color: "#9e9ea3",   
  },
  saveButton: {
    backgroundColor: "#445eae",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  cancelButton: {
    backgroundColor: "#aa2929",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },



});