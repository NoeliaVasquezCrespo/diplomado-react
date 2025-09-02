import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import type { UserType } from './type';

type UserEditInfoDialogProps = {
    open: boolean;
    user: UserType | null;
    onClose: () => void;
    onSave: (
        id: number,
        data: { username?: string; password?: string }
    ) => Promise<void>;
};

export default function UserEditInfoDialog({ open, user, onClose, onSave, }: UserEditInfoDialogProps) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUsername(user ? user.username : '');
        setPassword('');
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        const dataToUpdate: { username?: string; password?: string } = {};

        if (username !== user.username) {
            dataToUpdate.username = username;
        }

        if (password.trim()) {
            dataToUpdate.password = password;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            alert('No hay cambios que guardar.');
            return;
        }

        try {
            setLoading(true);
            await onSave(user.id, dataToUpdate);
            setPassword('');
            onClose();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Hubo un error al actualizar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Actualizar usuario</DialogTitle>
            <DialogContent>
                <Typography variant='body2' sx={{ color: '#c22121ff' }}>
                    <IconButton disabled sx={{ p: 0, color: '#c22121ff', verticalAlign: 'middle' }}>
                        <ErrorOutlineIcon sx={{ p: 0, color: '#c22121ff', verticalAlign: 'middle' }}/>
                    </IconButton>
                     La contraseña es confidencial para cada usuario. Si no desea cambiar la contraseña, deja el campo vacío.
                </Typography>
                
                <Box mt={2}>

                    <TextField
                        fullWidth
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <br></br>
                    <TextField
                        fullWidth
                        label="Nueva contraseña (opcional)"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading || !username.trim()}
                >
                    {loading ? <CircularProgress size={20} /> : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
