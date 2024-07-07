import Organisation from "../models/organisation.models.js";

const getAllOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll({
      include: {
        model: User,
        where: { userId: req.userId },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Organisations fetched successfully",
      data: { organisations },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Unable to fetch organisations",
      statusCode: 400,
    });
  }
};

const getOrganisationById = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await Organisation.findByPk(orgId, {
      include: {
        model: User,
        where: { userId: req.userId },
      },
    });

    if (!organisation) {
      return res.status(404).json({
        status: "error",
        message: "Organisation not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation fetched successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Unable to fetch organisation",
      statusCode: 400,
    });
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  try {
    const organisation = await Organisation.create({
      name,
      description,
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Unable to create organisation",
      statusCode: 400,
    });
  }
};

const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: "error",
        message: "Organisation not found",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Unable to add user to organisation",
      statusCode: 400,
    });
  }
};

export {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
};
