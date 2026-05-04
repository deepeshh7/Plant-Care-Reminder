import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePlantSchema } from "@/lib/validations/plant";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const plant = await prisma.plant.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        careSchedules: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Get plant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPlant = await prisma.plant.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDeleted: false,
      },
    });

    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = updatePlantSchema.parse(body);

    const plant = await prisma.plant.update({
      where: { id },
      data: {
        ...validatedData,
        acquisitionDate: validatedData.acquisitionDate
          ? new Date(validatedData.acquisitionDate)
          : null,
      },
      select: {
        id: true,
        name: true,
        species: true,
        imageUrl: true,
        location: true,
        acquisitionDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Update plant error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPlant = await prisma.plant.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDeleted: false,
      },
    });

    if (!existingPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    await prisma.plant.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Delete plant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
