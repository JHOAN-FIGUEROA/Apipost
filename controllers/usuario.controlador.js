const { Usuario, Cliente } = require('../models');
const bcrypt = require('bcryptjs');

// Registrar Usuario y Cliente

const registrarUsuario = async (req, res) => {
  try {
    const { usuario, cliente } = req.body;

    if (!usuario || !cliente) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos de usuario o cliente"
      });
    }

    const { nombreusuario, email, contrasena } = usuario;
    const { documentocliente, nombre, apellido, numerocontacto } = cliente;

    if (
      !nombreusuario || !email || !contrasena ||
      !documentocliente || !nombre || !apellido || !numerocontacto
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios"
      });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese email"
      });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuario.create({
      nombre: nombreusuario,
      email,
      password: hashedPassword,
      rol_idrol: 2,
      estado: 1
    });

    const nuevoCliente = await Cliente.create({
      documentocliente,
      nombre,
      apellido,
      email,
      numerocontacto,
      usuario_idusuario: nuevoUsuario.idusuario,
      estado: 1
    });

    // Enviar correo de confirmación
    await enviarCorreoConfirmacion(nuevoCliente.email, nuevoCliente.nombre);

    return res.status(201).json({
      success: true,
      message: "Usuario y cliente creados exitosamente",
      data: {
        usuario: nuevoUsuario,
        cliente: nuevoCliente
      }
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar usuario y cliente",
      error: error.message
    });
  }
};

// Iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Faltan email o contraseña"
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, usuario.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    const cliente = await Cliente.findOne({ where: { usuario_idusuario: usuario.idusuario } });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        usuario,
        clientId: cliente.idcliente, // si usas este campo
        documentocliente: cliente.documentocliente // ✅ aquí está lo que pediste
      }
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};


module.exports = {
  registrarUsuario,
  iniciarSesion
};
