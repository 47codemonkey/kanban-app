import express, { Request, Response } from 'express';
import Card, { ICard } from '../models/Card';

const router = express.Router();

interface CreateCardBody {
  title: string;
  description: string;
  status: string;
  boardId: string;
}

interface UpdateCardBody {
  title?: string;
  description?: string;
  status?: string;
}

interface ErrorResponse {
  error: string;
}
interface SuccessResponse {
  message: string;
}

router.get('/', async (req: Request, res: Response<ICard[] | ErrorResponse>) => {
  try {
    const { boardId } = req.query;

    const query: any = {};
    if (boardId) {
      query.boardId = boardId;
    }

    const cards = await Card.find(query);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request<{}, {}, CreateCardBody>, res: Response<ICard | ErrorResponse>) => {
  try {
    const { title, description, status, boardId } = req.body;
    const newCard = new Card({ title, description, status, boardId });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error saving card:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put(
  '/:id',
  async (req: Request<{ id: string }, {}, UpdateCardBody>, res: Response<ICard | null | ErrorResponse>) => {
    try {
      const { title, description, status } = req.body;
      const updatedCard = await Card.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
      res.json(updatedCard);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
);

router.delete('/:id', async (req: Request<{ id: string }>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

// import express, { Request, Response } from 'express';
// import Card, { ICard } from '../models/Card';

// const router = express.Router();

// interface CreateCardBody {
//   title: string;
//   description: string;
//   status: string;
// }
// interface UpdateCardBody {
//   title?: string;
//   description?: string;
//   status?: string;
// }

// interface ErrorResponse {
//   error: string;
// }
// interface SuccessResponse {
//   message: string;
// }

// router.get('/', async (req: Request, res: Response<ICard[] | ErrorResponse>) => {
//   try {
//     const cards = await Card.find();
//     res.json(cards);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.post('/', async (req: Request<{}, {}, CreateCardBody>, res: Response<ICard | ErrorResponse>) => {
//   try {
//     const { title, description, status } = req.body;
//     const newCard = new Card({ title, description, status });
//     await newCard.save();
//     res.status(201).json(newCard);
//   } catch (error) {
//     console.error('Error saving card:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.put(
//   '/:id',
//   async (req: Request<{ id: string }, {}, UpdateCardBody>, res: Response<ICard | null | ErrorResponse>) => {
//     try {
//       const { title, description, status } = req.body;
//       const updatedCard = await Card.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
//       res.json(updatedCard);
//     } catch (error) {
//       res.status(500).json({ error: 'Server error' });
//     }
//   },
// );

// router.delete('/:id', async (req: Request<{ id: string }>, res: Response<SuccessResponse | ErrorResponse>) => {
//   try {
//     await Card.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Card deleted' });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default router;
