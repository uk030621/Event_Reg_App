//app/api/users/route.js

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Handle POST request (storing user input)
export async function POST(req) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Register"); // Replace with your DB name
    const collection = db.collection("users");

    const result = await collection.insertOne({ name });
    // Return the inserted document with _id
    return NextResponse.json({
      message: "User added successfully",
      user: { _id: result.insertedId, name },
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to add user" }, { status: 500 });
  }
}

// Handle GET request (retrieving stored users)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Register"); // Replace with your DB name
    const collection = db.collection("users");

    const users = await collection.find({}).toArray();
    // Convert ObjectId to string for client-side usage
    const usersWithId = users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
    }));
    return NextResponse.json(usersWithId);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 500 }
    );
  }
}

// Handle PATCH request (updating user data)
export async function PATCH(req) {
  try {
    const { _id, name } = await req.json();

    if (!_id || !name) {
      return NextResponse.json(
        { error: "User ID and new name are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Register"); // Replace with your DB name
    const collection = db.collection("users");

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { name } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No user found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) }); // Convert the ID to ObjectId
    return new Response(
      JSON.stringify({ message: "URL deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete URL" }), {
      status: 500,
    });
  }
}
